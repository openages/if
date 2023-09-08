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
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "achive_time": {
                        "type": "number"
                  },
                  "tag_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "if_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "circle": {
                        "type": "object",
                        "properties": {
                              "enabled": {
                                    "type": "boolean"
                              },
                              "value": {
                                    "type": "array",
                                    "items": {
                                          "type": "number"
                                    }
                              }
                        },
                        "required": [
                              "enabled",
                              "value"
                        ]
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object"
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
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "achive_time": {
                        "type": "number"
                  },
                  "tag_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "if_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "circle": {
                        "type": "object",
                        "properties": {
                              "enabled": {
                                    "type": "boolean"
                              },
                              "value": {
                                    "type": "array",
                                    "items": {
                                          "type": "number"
                                    }
                              }
                        },
                        "required": [
                              "enabled",
                              "value"
                        ]
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object"
                        }
                  }
            },
            "required": [
                  "id",
                  "text",
                  "type"
            ]
      },
      "Todo.Title": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "const": "title"
                  },
                  "text": {
                        "type": "string"
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  }
            },
            "required": [
                  "id",
                  "text",
                  "type"
            ]
      },
      "Todo.Todo": {
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
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "achive_time": {
                        "type": "number"
                  },
                  "tag_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "if_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "circle": {
                        "type": "object",
                        "properties": {
                              "enabled": {
                                    "type": "boolean"
                              },
                              "value": {
                                    "type": "array",
                                    "items": {
                                          "type": "number"
                                    }
                              }
                        },
                        "required": [
                              "enabled",
                              "value"
                        ]
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object"
                        }
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  }
            },
            "required": [
                  "angle_id",
                  "id",
                  "status",
                  "text",
                  "type"
            ]
      }
} as const