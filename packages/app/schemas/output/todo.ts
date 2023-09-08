export default {
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
      },
      "Todo.Data": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "desc": {
                        "type": "string"
                  },
                  "angles": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "id": {
                                          "type": "string"
                                    },
                                    "text": {
                                          "type": "string"
                                    }
                              },
                              "required": [
                                    "id",
                                    "text"
                              ]
                        }
                  },
                  "tags": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "id": {
                                          "type": "string"
                                    },
                                    "color": {
                                          "type": "string"
                                    },
                                    "text": {
                                          "type": "string"
                                    }
                              },
                              "required": [
                                    "id",
                                    "color",
                                    "text"
                              ]
                        }
                  },
                  "settings": {
                        "type": "object",
                        "properties": {
                              "auto_archiving": {
                                    "type": "string",
                                    "enum": [
                                          "0m",
                                          "3m",
                                          "3h",
                                          "1d",
                                          "3d",
                                          "7d"
                                    ]
                              }
                        },
                        "required": [
                              "auto_archiving"
                        ]
                  }
            },
            "required": [
                  "id",
                  "angles",
                  "tags",
                  "settings"
            ]
      }
} as const