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
                        }
                  },
                  "archive": {
                        "type": "array",
                        "items": {
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