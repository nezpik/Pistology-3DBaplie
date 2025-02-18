import google.generativeai as genai
import os
from dotenv import load_dotenv
import dash
from dash import html, dcc
import plotly.graph_objects as go
import pandas as pd
import json
from typing import List, Dict, Any

# Load environment variables
load_dotenv()

# Configure Gemini API
GOOGLE_API_KEY = os.getenv('GEMINI_API_KEY')
if not GOOGLE_API_KEY:
    raise ValueError("Please set GEMINI_API_KEY in .env file")
    
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Gemini 2.0 Flash model with structured output
model = genai.GenerativeModel('gemini-2.0-flash')

# Define the response schema for container data
container_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "container_id": {"type": "string"},
            "bay": {"type": "integer"},
            "row": {"type": "integer"},
            "tier": {"type": "integer"},
            "size": {"type": "string", "enum": ["20", "40", "45"]},
            "type": {"type": "string", "enum": ["GP", "RE", "OT"]}
        },
        "required": ["container_id", "bay", "row", "tier", "size", "type"]
    }
}

class BaplieProcessor:
    def __init__(self):
        self.containers = []
        
    def extract_container_info(self, baplie_content: str) -> List[Dict[str, Any]]:
        """Extract container information from BAPLIE message using regex patterns"""
        containers = []
        
        # Split the message into segments
        segments = baplie_content.split("'")
        
        for i, segment in enumerate(segments):
            if segment.startswith('EQD+CN'):
                # Extract container ID and type
                parts = segment.split('+')
                if len(parts) >= 3:
                    container_id = parts[2]
                    container_type = 'GP'
                    size = '20'
                    
                    if len(parts) >= 4:
                        type_info = parts[3].split(':')[0]
                        if 'R' in type_info:
                            container_type = 'RE'
                        elif 'OT' in type_info:
                            container_type = 'OT'
                        
                        if '42' in type_info or '45' in type_info:
                            size = '40' if '42' in type_info else '45'
                    
                    # Look for location in next segment
                    if i + 1 < len(segments):
                        loc_segment = segments[i + 1]
                        if loc_segment.startswith('LOC+147'):
                            position = loc_segment.split('+')[2]
                            if len(position) >= 7:
                                bay = int(position[0:2])
                                row = int(position[2:4])
                                tier = int(position[4:6])
                                
                                containers.append({
                                    "container_id": container_id,
                                    "bay": bay,
                                    "row": row,
                                    "tier": tier,
                                    "size": size,
                                    "type": container_type
                                })
        
        return containers
        
    def parse_baplie(self, baplie_content):
        """Parse BAPLIE EDI message and extract container positions"""
        try:
            # First try direct parsing
            self.containers = self.extract_container_info(baplie_content)
            
            if not self.containers:
                # If direct parsing fails, use Gemini as backup
                prompt = f"""
                You are a BAPLIE EDI message parser. Analyze this BAPLIE message and extract container positions:
                {baplie_content}

                Extract and return ONLY a JSON array with this exact format, nothing else:
                [{{
                    "container_id": "CONTAINER_NUMBER",
                    "bay": BAY_NUMBER,
                    "row": ROW_NUMBER,
                    "tier": TIER_NUMBER,
                    "size": "20/40/45",
                    "type": "CONTAINER_TYPE"
                }}]

                Notes:
                - Bay numbers are even for 20ft containers and odd for 40/45ft
                - Row numbers start from 00 and increase outward from centerline
                - Tier numbers start from 02 (bottom) and increase upward
                - Container types include: GP (General Purpose), RE (Reefer), OT (Open Top)
                """

                response = model.generate_content(
                    prompt,
                    generation_config={
                        "temperature": 0.1,
                        "top_p": 0.8,
                        "top_k": 40
                    }
                )
                
                # Extract the JSON part from the response
                text = response.text.strip()
                if text.startswith('```json'):
                    text = text[7:]
                if text.endswith('```'):
                    text = text[:-3]
                    
                self.containers = json.loads(text.strip())
                
        except Exception as e:
            print(f"Error parsing BAPLIE: {str(e)}")
            self.containers = []
            
    def generate_3d_visualization(self):
        """Generate 3D visualization using Plotly"""
        if not self.containers:
            return go.Figure()
            
        df = pd.DataFrame(self.containers)
        
        # Create 3D boxes for each container
        boxes = []
        colors = {'GP': 'blue', 'RE': 'red', 'OT': 'green'}
        
        for _, container in df.iterrows():
            length = 2 if container['size'] in ['40', '45'] else 1
            color = colors.get(container['type'], 'gray')
            
            box = go.Mesh3d(
                x=[container['bay'], container['bay'], container['bay'], container['bay'],
                   container['bay']+length, container['bay']+length, container['bay']+length, container['bay']+length],
                y=[container['row'], container['row'], container['row']+1, container['row']+1,
                   container['row'], container['row'], container['row']+1, container['row']+1],
                z=[container['tier'], container['tier']+1, container['tier'], container['tier']+1,
                   container['tier'], container['tier']+1, container['tier'], container['tier']+1],
                i=[0, 0, 0, 1, 4, 4, 2, 3, 6, 7, 4, 5],
                j=[1, 2, 4, 2, 5, 6, 3, 6, 7, 6, 5, 7],
                k=[2, 3, 5, 3, 6, 7, 6, 7, 6, 5, 7, 4],
                name=f"{container['container_id']} ({container['type']} {container['size']}')",
                color=color,
                showscale=False
            )
            boxes.append(box)
            
        fig = go.Figure(data=boxes)
        fig.update_layout(
            scene=dict(
                xaxis_title='Bay',
                yaxis_title='Row',
                zaxis_title='Tier',
                camera=dict(
                    eye=dict(x=2, y=2, z=2)
                )
            ),
            title="3D Ship Container Visualization",
            showlegend=True
        )
        return fig

# Initialize Dash app
app = dash.Dash(__name__)

app.layout = html.Div([
    html.H1("BAPLIE 3D Visualizer", style={'textAlign': 'center'}),
    
    html.Div([
        dcc.Textarea(
            id='baplie-input',
            placeholder='Paste your BAPLIE message here...',
            style={'width': '100%', 'height': 200, 'margin': '10px 0'}
        ),
        
        html.Button(
            'Generate 3D View', 
            id='generate-button', 
            n_clicks=0,
            style={
                'backgroundColor': '#4CAF50',
                'color': 'white',
                'padding': '10px 20px',
                'border': 'none',
                'borderRadius': '4px',
                'cursor': 'pointer'
            }
        ),
        
        html.Div(id='error-message', style={'color': 'red', 'margin': '10px 0'})
    ], style={'width': '80%', 'margin': '0 auto'}),
    
    dcc.Graph(
        id='3d-container-view',
        style={'height': '800px'}
    )
], style={'padding': '20px'})

@app.callback(
    [dash.Output('3d-container-view', 'figure'),
     dash.Output('error-message', 'children')],
    [dash.Input('generate-button', 'n_clicks')],
    [dash.State('baplie-input', 'value')]
)
def update_3d_view(n_clicks, baplie_content):
    if n_clicks > 0 and baplie_content:
        try:
            processor = BaplieProcessor()
            processor.parse_baplie(baplie_content)
            if processor.containers:
                return processor.generate_3d_visualization(), ""
            else:
                return go.Figure(), "Failed to parse BAPLIE message. Please check the format and try again."
        except Exception as e:
            return go.Figure(), f"Error: {str(e)}"
    return go.Figure(), ""

if __name__ == '__main__':
    app.run_server(debug=True)
