export default {
      "Todo.TodoItem": {
            "type": "object",
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
                        "type": "number",
                        "const": 0
                  }
            },
            "required": [
                  "type"
            ]
      },
      "Todo.Data": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "file_id": {
                        "type": "string"
                  },
                  "name": {
                        "type": "string"
                  },
                  "desc": {
                        "type": "string"
                  },
                  "angles": {
                        "type": "object",
                        "additionalProperties": {
                              "type": "array",
                              "items": {
                                    "type": "object",
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
                                                "type": "number",
                                                "const": 0
                                          }
                                    },
                                    "required": [
                                          "type"
                                    ]
                              }
                        }
                  },
                  "archive": {
                        "type": "array",
                        "items": {
                              "type": "object",
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
                                          "type": "number",
                                          "const": 0
                                    }
                              },
                              "required": [
                                    "type"
                              ]
                        }
                  }
            },
            "required": [
                  "id",
                  "file_id",
                  "name",
                  "angles",
                  "archive"
            ]
      }
} as const