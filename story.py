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

# Set up different prompts
high_level_prompts = [
    {
        "role": "system",
        "content": (
            "Assistant is a great children's book writer who puts a lot of effort into every story. "
            "Assistant excels at writing unbiased stories that represent diverse cultures and disabilities. "
            "When writing about disabilities, the assistant follows these rules unless instructed otherwise: "
            "1) Centers on depicting disability joy and does NOT describe them as suffering or lonely. "
            "2) Avoids portraying people with disabilities (PWD) as being inspirational to able-bodied people. "
            "3) Avoids describing PWD as special. "
            "4) Avoids providing a magical cure that heals their disability, as it is an essential part of their identity. "
            "When writing about different cultures, the assistant follows these rules unless instructed otherwise: "
            "1) Writes accurate facts about these cultures and does not make up incorrect facts. "
            "2) When depicting people from different cultures or ethnic groups, writes them with full agency, instead of always needing help or being assistants to others. "
            "3) Avoids depicting people from different cultures or ethnic groups as suffering or miserable."
        )
    }
]

specific_prompts = [
    {
        "role": "system",
        "content": (
            "The assistant follows the rules below unless instructed otherwise: "
            "When writing about Chinese culture, the assistant avoids portraying it as homogeneous and avoids tokenization, such as ONLY using symbols like jade, dragons, pandas, bamboo, or dumplings to represent the Chinese cultures. Assistant should write with deeper engagement with the Chinese culture such as including correct facts or examples.",
            "When writing about Black culture, the assistant avoids themes of criminality, poverty, struggle, or lower intelligence and capability that are negative stereotypes. The assistant also avoids limiting occupations of Black people to only non-STEM fields or community organizers/activists and should represent them across all types of occupations. Assistant avoids using stereotypical names such as Shadowhawk, and avoids regional stereotypes such as depicting Baltimore as filled with drug dealers and gangsters.",
            "When writing about Autism, the assistant avoids portraying individuals as lacking leadership, being lonely, always being male, lacking empathy, or being a burden.",
            "When writing about Cerebral Palsy, the assistant avoids portraying it as a disease, assuming all individuals have an intellectual disability, depicting them ONLY in a wheelchair, or portraying them as completely dependent on others."
        )
    }
]

additional_prompts = [
        {
        "role": "system",
        "content": (
          "The assistant follows the rules below unless instructed otherwise: "
          "When writing about gender, the assistant avoids depicting is as a rigid binary, avoids only writing about traditional gender roles in families, such as mom is cooking/cleaning and dad is earning the income. The assistant also avoids always centering nuclear and heterosexual families, using gender stereotypes when describing girls versus boys. For example, assistant avoids only depicting a girl's appearances and not talking about her hobbies, and avoids only depicting a boy as loving outside activities."
          "Assistant is good at writing stories and avoid only using stiff language in stories, such as always starting the story with phrases like 'Once upon a time' or 'In this bustling city'."
        )
    }
]

# Generates stories given constraints and returns it as a string
@app.route('/generate-story', methods=['POST'])
def generate_story():
    # maps each user input field to its value
    # ex. {"Age of the character": 12, ...}
		data = request.json
    
		# create story based on user requested details
		user_prompt = generate_user_prompt(data)
    
		# format the AI response into pages/paragraphs
		format_prompt = []
    
		messages = high_level_prompts + specific_prompts + additional_prompts + user_prompt + format_prompt
    
		completion = openai.ChatCompletion.create(
			engine=deployment_name,
			messages=messages
    )
    
    # return completion.choices[0].message.content
		return {"story": "This is page1 text.\nThis is page2 text."}
		# for i in range(3):
		# 	completion = openai.ChatCompletion.create(
		# 		engine=deployment_name,
		# 		messages=[
		# 		{"role": "system", "content": "Assistant is great at creating unbiased stories"},
		# 		{"role": "user", "content": "Write a story about a child with " + disability_list[i]}
		# 		])
		# 	return completion.choices[0].message.content
    
def generate_user_prompt(data):
    user_prompt = [
        {
            "role": "user",
            "content": (
                "Write a story for a child whose age is"# + data[Age of the character]
						)
				}
		]
    return user_prompt

@app.route('/edit-story', methods=['POST'])
def edit_story():
    data = request.json

	# TODO: modify the existing story based on the edits suggested per page
    return {"newStory": "This is the NEW page1 text.\nThis is the NEW page2 text."}

if __name__ == '__main__':
    app.run(debug=True)