import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const { eventName, relationship, gender, age, hobbies, priceMin, priceMax } =
    req.body;
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generateGiftIdeasPrompt(
      eventName,
      relationship,
      gender,
      age,
      hobbies,
      priceMin,
      priceMax
    ),
    temperature: 0.7,
    max_tokens: 2048,
  });

  res
    .status(200)
    .json({ result: outputArray(completion.data.choices[0].text) });
}

function generateGiftIdeasPrompt(
  eventName = "",
  relationship = "",
  gender = "",
  age = "",
  interests = [],
  priceMin = "",
  priceMax = ""
) {
  // 3 [giftEvent] gifts for a [age] year old [gender] and [relationship] interests [interest1],[intrest2] price between [priceMin] and [priceMax]

  // 3 [giftEvent] gifts for [relationship] who is [age] year old [gender] interests [interest1],[intrest2] price between [priceMin] and [priceMax]
  // 3 gifts

  let prompt = "3";
  if (eventName != "") {
    prompt += ` ${eventName}`;
  }
  prompt += " gift ideas";
  if (relationship != "") {
    prompt += ` for ${relationship}`;
  }
  if (gender != "" || age != "") {
    prompt += relationship == "" ? " for" : " who is";
    if (age != "") {
      prompt += ` ${age} years old`;
    }
    if (gender != "") {
      prompt += ` ${gender}`;
    }
  }
  if (interests != "" && interests != []) {
    interests = interests.join(", ");
    interests = interests.replace(/, ([^,]*)$/, ", and $1");
    prompt += ` interests ${interests}`;
  }
  if (priceMin != "") {
    prompt += ` gift cost between ${priceMin} and ${priceMax}`;
  }
  prompt += ".";
  prompt += " surround name with ** than a short description";
  return prompt;
}
function outputArray(inputString) {
  const outputArray = inputString.split("\n").map((item) => {
    let title = "";
    let notes = "";

    if (item.match(/^\d/)) {
      item = item.slice(1);
    }
    if (item[0] == "." || item[0] == ",") {
      item = item.slice(1);
    }
    item = item.trim();

    console.log(item);
    if (item[0] == "*" && item[1] == "*") {
      const titleEndIndex = item.indexOf("**", 2);

      title = item.substring(2, titleEndIndex);
      if (title.match(/^\d/)) {
        if (title[1] == "." || title[1] == ",") {
          title = title.slice(2);
          title = title.trim();
        }
      }
      notes = item.substring(titleEndIndex + 2);
      notes = notes.trim();
      if (notes[0] == "-" || notes[0] == ":") {
        notes = notes.slice(1);
        notes = notes.trim();
      }
    } else {
      title = "Gift Idea";
      if (item.trim() == "") {
        return;
      } else {
        notes = item.trim();
      }
    }
    return { title, notes };
  });
  return outputArray.filter((n) => n);
}
