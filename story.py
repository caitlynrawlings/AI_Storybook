from flask import request, Flask
from flask_cors import CORS
import openai

# Setup flask
app = Flask(__name__)
CORS(app, origins='http://localhost:3000')

# Set up OpenAI API
openai.api_base = "https://openaiglazko.openai.azure.com/"
openai.api_key = "be9158e9d4ca4be080c4b1a3984edee2"
openai.api_type = 'azure'
openai.api_version = '2023-05-15' # this might change in the future

deployment_name='M4GPT4'
disability_list=["autism", "cerebral palsy", "deaf"]

# Generates stories given constraints and returns it as a string
@app.route('/generate-story', methods=['POST'])
def generate_story():
    # maps each user input field to its value
    # ex. {"Age of the character": 12, ...}
    data = request.json

    return {"story": "This is page1 text.\nThis is page2 text."}
	# for i in range(3):
	# 	completion = openai.ChatCompletion.create(
	# 		engine=deployment_name,
	# 		messages=[
	# 		{"role": "system", "content": "Assistant is great at creating unbiased stories"},
	# 		{"role": "user", "content": "Write a story about a child with " + disability_list[i]}
	# 		])
	# 	return completion.choices[0].message.content

@app.route('/edit-story', methods=['POST'])
def edit_story():
    data = request.json

	# TODO: modify the existing story based on the edits suggested per page
    return {"newStory": "This is the NEW page1 text.\nThis is the NEW page2 text."}

if __name__ == '__main__':
    app.run(debug=True)