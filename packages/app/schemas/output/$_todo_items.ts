export default {
      "TodoItems.Item": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "enum": [
                              "title",
                              "todo"
                        ]
                  },
                  "text": {
                        "type": "string"
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
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
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "tags": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "id": {
                                          "type": "string",
                                          "maxLength": 30
                                    },
                                    "color": {
                                          "type": "string"
                                    },
                                    "text": {
                                          "type": "string",
                                          "maxLength": 15
                                    }
                              },
                              "required": [
                                    "id",
                                    "color",
                                    "text"
                              ]
                        }
                  },
                  "if_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "circle": {
                        "type": "string"
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "additionalProperties": false
                        }
                  }
            },
            "required": [
                  "id",
                  "text",
                  "type"
            ]
      },
      "Todo.TodoItem": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "enum": [
                              "title",
                              "todo"
                        ]
                  },
                  "text": {
                        "type": "string"
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
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
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "tags": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "id": {
                                          "type": "string",
                                          "maxLength": 30
                                    },
                                    "color": {
                                          "type": "string"
                                    },
                                    "text": {
                                          "type": "string",
                                          "maxLength": 15
                                    }
                              },
                              "required": [
                                    "id",
                                    "color",
                                    "text"
                              ]
                        }
                  },
                  "if_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "circle": {
                        "type": "string"
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "additionalProperties": false
                        }
                  }
            },
            "required": [
                  "id",
                  "text",
                  "type"
            ]
      }
} as const