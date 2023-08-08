export default {
      "Todo.TodoItem": {
            "type": "object",
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
                                    },
                                    "angle": {
                                          "type": "string",
                                          "maxLength": 12
                                    },
                                    "tags": {
                                          "type": "array",
                                          "items": {
                                                "type": "object",
                                                "properties": {
                                                      "color": {
                                                            "type": "string"
                                                      },
                                                      "text": {
                                                            "type": "string"
                                                      }
                                                },
                                                "required": [
                                                      "color",
                                                      "text"
                                                ]
                                          }
                                    },
                                    "id": {
                                          "type": "string",
                                          "maxLength": 30
                                    }
                              },
                              "required": [
                                    "achive_time",
                                    "angle",
                                    "id",
                                    "status",
                                    "tags",
                                    "text",
                                    "type"
                              ]
                        }
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
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
                  },
                  "angle": {
                        "type": "string",
                        "maxLength": 12
                  },
                  "tags": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "color": {
                                          "type": "string"
                                    },
                                    "text": {
                                          "type": "string"
                                    }
                              },
                              "required": [
                                    "color",
                                    "text"
                              ]
                        }
                  }
            },
            "required": [
                  "id",
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
                  "name": {
                        "type": "string"
                  },
                  "icon": {
                        "type": "string"
                  },
                  "desc": {
                        "type": "string"
                  },
                  "angles": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "angle": {
                        "type": "string"
                  },
                  "tags": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "color": {
                                          "type": "string"
                                    },
                                    "text": {
                                          "type": "string"
                                    }
                              },
                              "required": [
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
                  "name",
                  "icon",
                  "angles",
                  "angle",
                  "tags",
                  "settings"
            ]
      }
} as const