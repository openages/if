export default {
      "TodoArchive.Item": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "todo": {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
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
                              "type"
                        ]
                  }
            },
            "required": [
                  "id",
                  "todo"
            ]
      },
      "Todo.TodoItem": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
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
                  "type"
            ]
      }
} as const