import gradio as gr
import json
import re
from typing import List, Tuple

class SimpleResearchAssistant:
    def __init__(self):
        # Pre-defined knowledge base about David Van Dijcke
        self.knowledge_base = {
            "bio": {
                "name": "David Van Dijcke",
                "position": "PhD student in Economics",
                "institution": "University of Michigan, Ann Arbor",
                "job_market": "2025-26 academic year",
                "fellowship": "Rackham Graduate School Predoctoral Fellow (2024-25)",
                "visitor": "Academic Visitor at the Bank of England",
                "education": "PhD in Economics (expected 2026), BA in Theatre"
            },
            "research_interests": [
                "Econometric methods",
                "Causal inference", 
                "Functional data analysis",
                "Optimal transport",
                "Labor market policies",
                "Mobility patterns in response to crises"
            ],
            "research_description": (
                "David's research develops novel econometric methods combining causal inference "
                "with functional data analysis and optimal transport to study settings where "
                "the outcomes and/or covariates are functional and high-dimensional."
            ),
            "publications": [
                {
                    "title": "Unmasking Partisanship",
                    "year": 2021,
                    "topic": "Partisanship and COVID-19 response"
                },
                {
                    "title": "Belief in Science and Compliance with COVID Measures",
                    "year": 2021,
                    "topic": "Science beliefs and pandemic compliance"
                },
                {
                    "title": "Government and Community Responses to COVID-19",
                    "year": 2020,
                    "topic": "COVID-19 policy responses"
                },
                {
                    "title": "Ukraine Public Opinion",
                    "year": 2023,
                    "topic": "Public opinion analysis"
                }
            ],
            "working_papers": [
                "Costs of Staying Open",
                "Protests and Mobile Devices", 
                "Effort",
                "Profiling Insurrection",
                "Revenue Production Functions",
                "FDD",
                "DISCO",
                "Return to Office",
                "R3D"
            ],
            "keywords": [
                "economics", "research", "publication", "paper", "work", "study",
                "method", "econometric", "causal", "inference", "functional",
                "career", "academic", "phd", "michigan", "job market"
            ]
        }
        
    def is_relevant_question(self, question: str) -> bool:
        """Check if question is related to academic/research topics"""
        question_lower = question.lower()
        
        # Check for research-related keywords
        relevant_patterns = [
            r'\b(research|paper|publication|work|study|method)\b',
            r'\b(econometric|causal|inference|functional|data)\b',
            r'\b(career|academic|phd|education|background)\b',
            r'\b(david|van dijcke)\b',
            r'\b(economics|economist)\b'
        ]
        
        # Check for irrelevant patterns
        irrelevant_patterns = [
            r'\b(weather|sport|movie|game|food|recipe)\b',
            r'\b(personal|private|family|hobby)\b',
            r'\b(political opinion|belief)\b'
        ]
        
        # Check if any relevant pattern matches
        has_relevant = any(re.search(pattern, question_lower) for pattern in relevant_patterns)
        has_irrelevant = any(re.search(pattern, question_lower) for pattern in irrelevant_patterns)
        
        return has_relevant and not has_irrelevant
    
    def generate_response(self, question: str) -> str:
        """Generate response based on the knowledge base"""
        question_lower = question.lower()
        
        # Check relevance first
        if not self.is_relevant_question(question):
            return (
                "I'm designed to answer questions about David Van Dijcke's academic research, "
                "publications, and career. Please ask about his work in economics, research methods, "
                "or academic background."
            )
        
        # Bio/background questions
        if any(word in question_lower for word in ["who is", "background", "education", "position"]):
            bio = self.knowledge_base["bio"]
            return (
                f"{bio['name']} is a {bio['position']} at {bio['institution']}. "
                f"He is on the job market for the {bio['job_market']}. "
                f"He is currently a {bio['fellowship']} and {bio['visitor']}. "
                f"His educational background includes: {bio['education']}."
            )
        
        # Research interests
        if any(word in question_lower for word in ["research interest", "study", "focus", "area"]):
            interests = ", ".join(self.knowledge_base["research_interests"])
            return (
                f"David's main research interests include: {interests}. "
                f"{self.knowledge_base['research_description']}"
            )
        
        # Publications
        if any(word in question_lower for word in ["publication", "paper", "published"]):
            pubs = self.knowledge_base["publications"]
            pub_list = [f"'{p['title']}' ({p['year']}) on {p['topic']}" for p in pubs]
            return (
                f"David has published several papers including: {'; '.join(pub_list)}. "
                f"He also has multiple working papers on topics ranging from labor economics to "
                f"econometric methods."
            )
        
        # Methods questions
        if any(word in question_lower for word in ["method", "econometric", "technique"]):
            return (
                "David develops novel econometric methods that combine causal inference with "
                "functional data analysis and optimal transport. These methods are particularly "
                "useful for studying settings where outcomes and/or covariates are functional "
                "and high-dimensional, such as analyzing mobility patterns or labor market dynamics."
            )
        
        # Job market
        if "job market" in question_lower:
            return (
                f"David Van Dijcke is on the job market for the {self.knowledge_base['bio']['job_market']}. "
                f"He is completing his PhD in Economics at {self.knowledge_base['bio']['institution']} "
                f"and his research focuses on developing novel econometric methods."
            )
        
        # Default response for other research questions
        return (
            "I can provide information about David Van Dijcke's research in economics, "
            "his publications, academic background, and methodological contributions. "
            "Please feel free to ask more specific questions about these topics!"
        )
    
    def chat(self, message: str, history: List[Tuple[str, str]]) -> str:
        """Main chat function"""
        return self.generate_response(message)

# Create Gradio interface
def create_interface():
    assistant = SimpleResearchAssistant()
    
    # Custom CSS
    custom_css = """
    #component-0 {
        max-width: 900px;
        margin: auto;
    }
    .gradio-container {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    """
    
    with gr.Blocks(theme=gr.themes.Soft(), css=custom_css) as demo:
        gr.Markdown(
            """
            # David Van Dijcke - Research Assistant
            
            Welcome! I'm an AI assistant designed to answer questions about David Van Dijcke's 
            academic research, publications, and career in economics.
            
            Ask me about:
            - His research interests and methods
            - Publications and working papers
            - Academic background and career
            - Econometric techniques he's developed
            """
        )
        
        chatbot = gr.Chatbot(
            height=450,
            bubble_full_width=False,
            avatar_images=(None, "🤖")
        )
        
        msg = gr.Textbox(
            label="Your Question",
            placeholder="Ask about David's research, publications, or academic background...",
            lines=2
        )
        
        with gr.Row():
            submit = gr.Button("Send", variant="primary")
            clear = gr.Button("Clear")
        
        # Example questions
        gr.Examples(
            examples=[
                "What are David's main research interests?",
                "Tell me about his econometric methods",
                "What has he published?",
                "What is his educational background?",
                "Is he on the job market?"
            ],
            inputs=msg
        )
        
        # Event handlers
        def respond(message, chat_history):
            bot_message = assistant.chat(message, chat_history)
            chat_history.append((message, bot_message))
            return "", chat_history
        
        msg.submit(respond, [msg, chatbot], [msg, chatbot])
        submit.click(respond, [msg, chatbot], [msg, chatbot])
        clear.click(lambda: None, None, chatbot, queue=False)
    
    return demo

if __name__ == "__main__":
    demo = create_interface()
    demo.launch(share=True)