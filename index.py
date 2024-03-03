from flask import Flask, request, jsonify
from pinecone import Pinecone
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
import fireworks.client

# Set up Pinecone and HuggingFace embeddings
fireworks.client.api_key = "W4etuSqWlXPUIa8gsuz8g9kCvz6KGNsSF4q8FePNjpBLOgfF"
pc = Pinecone(api_key='b6f2f628-c33f-47dd-b089-8206a99ce18f')
embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
index = pc.Index("test")

def askLLM(prompt):
    completion = fireworks.client.ChatCompletion.create(
        model="accounts/fireworks/models/mixtral-8x7b-instruct",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        n=1,
        max_tokens=4000,
        temperature=0.1,
        top_p=0.9,
    )
    return completion.choices[0].message.content

app = Flask(__name__)

@app.route('/completion', methods=['POST'])
def get_completion():
    data = request.get_json()
    message = data['message']
    flag = data['flag']
    if flag == "1":
        text = """Last Updated on November 5th, 2023
Tejas Thorat
ï www.linkedin.com/in/tejaspthorat # tejaspthorat@gmail.com
Education
Pune Institute of Computer Technology 2021 - 2025
Bachelor of Engineering in Computer Engineering with honors in Data Science Current GPA: 7.86/10
Achievements
Rank 1 at Tata Power 24-Hr Hackathon
• Secured first place at Tata Power 24-Hour Hackathon with a data analytics solution, employing LSTM and
Random Forest algorithms for solar data analysis.
• Developed a specialized API using Hugging Face Transformers and Langchain for Llama-2 LLM, enabling
tailored responses in the hackathon.
All India Rank 6 at DD National Robocon
• Achieved All India Rank 6 at DD National Robocon, showcasing exceptional robotics and engineering skills
in a highly competitive event.
Skills
Languages: C++, Python, JavaScript, HTML/CSS, MySQL
Other: 3D printing with Solidworks
Tools: Git/GitHub, VS Code, IntelliJ IDEA, Anaconda
Frameworks: NextJS, Langchain, Django, TensorFlow
Projects
PageTalk | Python, React.js, Express.js, Llama-2 LLM, Langchain, Huggingface, VS Code August 2023 – Present
• Built an AI-driven LLM document reader, enabling dynamic document inquiries and seamless note-taking to
optimize information assimilation
• Designed and implemented a REST API endpoint for the llama-2 model, enhancing its accessibility and usability.
• Utilized GPU cloud hosting services to optimize the llama-2 model’s performance, enabling rapid processing and
real-time responses.
Sentinel drone | ROS, Python, Gazebo, Linux September 2022
• The aim of this project is to design and develop a fully automated sentinel drone that can detect colored blocks and
hover over them.
• Utilized OpenCV for real-time image processing to enable autonomous navigation and object recognition.
• Designed and implemented PID control algorithms for precise drone stabilization and flight path control.
• Hands-on experience with drone hardware like flight controller, electronic speed controller and sensors
AutoInsight | Python, pytorch, yolov5, Flutter, Immage processing April 2023
• Engineered a blind spot monitoring system that utilized cameras to detect vehicles in a driver’s blind spots. This
system provided timely visual and auditory alerts to drivers, significantly reducing the risk of accidents during lane
changes and merging maneuvers.
Experience
PICT Robotics | Automation Lead Present
Robot Development: Leading the design and construction of robots from scratch, adhering to the strict competition
guidelines and rules of the Robocon event. This involved a holistic approach, including mechanical, electrical, and
software design."""
        prompt = f"""You are a smart AI assistant that answers user questions.

        user_query: {message}

        Answer user queries according to your knowledge or based on the context provided below

        context: {text}

        If the context provided does not answer user query, you can answer outside the context but you have to warn user about it
        """
        completion = askLLM(prompt)
        return jsonify({'completion': completion})
    else:

        query = embeddings.embed_documents([message])
        out = index.query(
            namespace="ns1",
            vector=query,
            top_k=5,
            include_values=True,
            include_metadata=True
        )
        context = out.matches[0].metadata['description']
        prompt = f"""You are a smart AI assistant that answers user questions.

    user_query: {message}

    Answer user queries according to your knowledge or based on the context provided below

    context: {context}

    If the context provided does not answer user query, you can answer outside the context but you have to warn user about it
    """
        completion = askLLM(prompt)
        return jsonify({'completion': completion})



if __name__ == '__main__':
    app.run(debug=True, port=8000)


#print("HELLOOO")