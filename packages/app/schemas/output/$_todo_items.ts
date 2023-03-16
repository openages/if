export default {
      "TodoItems.Item": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "type": {
                        "type": "string",
                        "enum": [
                              "group",
                              "todo"
                        ]
                  },
                  "title": {
                        "type": "string"
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "additionalProperties": false,
                              "properties": {
                                    "type": {
                                          "type": "string",
                                          "const": "todo"
                                    },
                                    "text": {
                                          "type": "string"
                                    },
                                    "status": {
                                          "type": "string",
                                          "enum": [
                                                "checked",
                                                "unchecked",
                                                "closed"
                                          ]
                                    },
                                    "achive_time": {
                                          "type": "number"
                                    }
                              },
                              "required": [
                                    "achive_time",
                                    "status",
                                    "text",
                                    "type"
                              ]
                        }
                  },
                  "text": {
                        "type": "string"
                  },
                  "status": {
                        "type": "string",
                        "enum": [
                              "checked",
                              "unchecked",
                              "closed"
                        ]
                  },
                  "achive_time": {
                        "type": "number"
                  }
            },
            "required": [
                  "id",
                  "type"
            ]
      }
} as const