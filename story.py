from flask import request, Flask, jsonify
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

#deployment_name='GPT35'
deployment_name='M4GPT4'
disability_list=["autism", "cerebral palsy", "deaf"]

# Set up system prompts
with open('prompt.txt', 'r') as file:
    # Read all the contents of the file
    system_prompts_text = file.read()
system_prompt = [{"role": "system", "content": system_prompts_text}]

# test_user_prompt = [
#         {	"role" : "user",
#             "content": (
#             "Write a story for a child whose age is 8. The story should have a total word count of 300. "
#             "Split the story into pages like in a children's storybook, with a reasonable amount of words per page, "
#             "and separate each page's content with a new line character '\\n'. The main character of the story is age: 8, gender: male, race/ethnicity: Asian, "
#             "and with disability: autism. The overall storyline is A brave child who explores the world. "
#             "The story should represent the main character's culture this way: Positive and the main character's disability this way: Empowering. "
#             "The story should include the following additional elements in the plot:\n"
#             "- Set up: Introduction of the character\n"
#             "- Inciting incident: Finds a magical object\n"
#             "- Increasing action: Adventures with the object\n"
#             "- Climax: Faces a big challenge\n"
#             "- Subsiding action: Overcomes the challenge\n"
#             "- Resolution: Returns home with new wisdom\n"
#     )}]


def generate_user_prompt(data):
    age = data.get("Target Age of Audience", "young")
    word_count = data.get("Word count (optional)", "")
    char_age = data.get("Age of the character", "young")
    char_gender = data.get("Gender", "")
    char_race = data.get("Race/ethnicity", "")
    char_disability = data.get("Disability", "")
    culture = data.get("Cultural Representation", "")
    disability = data.get("Disability Representation", "")
    description = data.get("Enter Story Description", "")
    set_up = data.get("Set-up (optional)", "")
    inciting_incident = data.get("Inciting incident (optional)", "")
    increasing_action = data.get("Increasing action (optional)", "")
    climax = data.get("Climax (optional)", "")
    subsiding_action = data.get("Subsiding action (optional)", "")
    resolution = data.get("Resolution (optional)", "")

    prompt = f"Write a story for a child whose age is {age}."
    if word_count:
      prompt += f"The story should have a total word count of {word_count}."
    else:
      prompt += f"The story should have a total word count that is reasonable for a child of age {age}."
    prompt += "Split the story into pages like in a children's storybook, with reasonable amount of words per page."
    prompt += "Format the story pages in the structure of a json string, where each key is the page number, and the value is the string content of that page."

    prompt += f"The main character of the story is age: {char_age}, gender: {char_gender}, race/ethnicity: {char_race}, and with disability: {char_disability}"
    prompt += f"The overall storyline is {description}"
    prompt += f"The story should represent the main character's culture this way: {culture} and the main character's disability this way: {disability}"
    prompt += "The story should include the following additional elements in the plots:\n"

    if set_up:
        prompt += f"- Set up: {set_up}\n"
    if inciting_incident:
        prompt += f"-Inciting incident: {inciting_incident}\n"
    if increasing_action:
        prompt += f"- Increasing action: {increasing_action}\n"
    if climax:
        prompt += f"- Climax: {climax}\n"
    if subsiding_action:
        prompt += f"- Subsiding action: {subsiding_action}\n"
    if resolution:
        prompt += f"- Resolution: {resolution}\n"

    user_prompt = [
        {
            "role": "user",
            "content": prompt
		}
	]
    return user_prompt

# Generates stories given constraints and returns it as a string
@app.route('/generate-story', methods=['POST'])
def generate_story():
    # maps each user input field to its value
    # ex. {"Age of the character": 12, ...}
    data = request.json

    # create story based on user requested details and also format the response
    user_prompt = generate_user_prompt(data)

    messages = system_prompt + user_prompt

    completion = openai.ChatCompletion.create(
        engine=deployment_name,
        messages=messages
    )
    
    generated_story = completion.choices[0].message.content
    rewrite_story = self_edit_story(generated_story)

    # return completion.choices[0].message.content # this is test
    return jsonify({"story": rewrite_story})
        # return {"story": "This is page1 text.\nThis is page2 text."}
		# for i in range(3):
		# 	completion = openai.ChatCompletion.create(
		# 		engine=deployment_name,
		# 		messages=[
		# 		{"role": "system", "content": "Assistant is great at creating unbiased stories"},
		# 		{"role": "user", "content": "Write a story about a child with " + disability_list[i]}
		# 		])
		# 	return completion.choices[0].message.content

def self_edit_story(story):
    self_edit_prompt = [
        {
            "role": "user",
            "content": f"Taking the perspective of a children's story book editor who is good at writing unbiased stories. Read through the story below to give suggestions on improving it to avoid any negative stereotypes of disability (suffering, dependent, does not like ) and to avoid any negative stereotypes of different cultures (avoids negative stereotypes of Black culture: criminality, poverty, struggle, or lower intelligence and capability, avoid depicting Chinese cultures as tokens of bamboo, dragons, dumplings, pandas, jade..). Here is the story: \n" + story
		}
	]

    edits = openai.ChatCompletion.create(
        engine=deployment_name,
        messages=self_edit_prompt
    )
    
    rewrite_prompt = [
        {
            "role": "user",
            "content": f"Read the suggestions below and rewrite your story to avoid stereotypes. Keep the story in the same format of pages. Here are the suggestions \n" + edits.choices[0].message.content
        }
    ]

    rewrite = openai.ChatCompletion.create(
        engine=deployment_name,
        messages=rewrite_prompt
    )

    return rewrite.choices[0].message.content
    


@app.route('/edit-story', methods=['POST'])
def edit_story():
    data = request.json

    edit_suggestions = '\n'.join(data)
    edit_prompt = [
        {
            "role": "user",
            "content": f"Read the edit suggestions below and based on these edits to improve the story. Keep the story in the same format of pages. Here are the suggestions: \n {edit_suggestions}" 
        }
    ]

    completion = openai.ChatCompletion.create(
        engine=deployment_name,
        messages=edit_prompt
    )

    return jsonify({"newStory": completion.choices[0].message.content})


if __name__ == '__main__':
    app.run(debug=True)
    # story = generate_story()
    # print(story)