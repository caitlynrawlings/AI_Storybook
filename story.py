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
def execute_script():
    data = request.json
    return {"story": "RESULT FROM GPT PAGE 1", "userInput": data}
	# for i in range(3):
	# 	completion = openai.ChatCompletion.create(
	# 		engine=deployment_name,
	# 		messages=[
	# 		{"role": "system", "content": "Assistant is great at creating unbiased stories"},
	# 		{"role": "user", "content": "Write a story about a child with " + disability_list[i]}
	# 		])
	# 	return completion.choices[0].message.content

if __name__ == '__main__':
    app.run(debug=True)