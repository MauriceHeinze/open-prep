Store writing prompt JSON files in this folder.

Current catalog files:

- `email-tasks.json`
- `academic-discussion-tasks.json`

The loader reads every `.json` file in this folder, so filenames can change as long as the file contents still match the schema below.

Each `.json` file should contain an array of prompt objects with this shape:

```json
[
  {
    "id": "wrong-headphones-delivered",
    "title": "Wrong Headphones Delivered",
    "category": "Email",
    "type": "email",
    "examType": "toefl",
    "sectionType": "writing",
    "scenario": "<p>You recently ordered a pair of wireless headphones...</p>"
  },
  {
    "id": "targeted-advertising-ethics",
    "title": "Targeted Advertising Ethics",
    "category": "Academic Discussion Question",
    "type": "academic-discussion",
    "examType": "toefl",
    "sectionType": "writing",
    "scenario": "<p>The professor is teaching a class on marketing...</p>",
    "discussion": {
      "professor": "Today, we're discussing the ethics of targeted advertising...",
      "studentA": "I think targeted advertising is an invasion of privacy...",
      "studentB": "I disagree. To me, targeted advertising is ethical..."
    }
  }
]
```

Academic discussion prompts get deterministic random-looking names plus gender-matched
UI Faces avatars from `public/avatars/uifaces` at load time, so the JSON only needs
the message text.

Legacy prompt files using `instructions`, `question`, `passage`, and `recommendedWordCount`
are still supported.
