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
                  "checked_point": {
                        "type": "number",
                        "const": 0
                  }
            },
            "required": [
                  "type"
            ],
            "additionalProperties": false
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
                                          "checked_point": {
                                                "type": "number",
                                                "const": 0
                                          }
                                    },
                                    "required": [
                                          "type"
                                    ],
                                    "additionalProperties": false
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
                                    "checked_point": {
                                          "type": "number",
                                          "const": 0
                                    }
                              },
                              "required": [
                                    "type"
                              ],
                              "additionalProperties": false
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