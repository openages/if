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
                                                }
                                          },
                                          "required": [
                                                "achive_time",
                                                "angle",
                                                "status",
                                                "tags",
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
                                    }
                              },
                              "required": [
                                    "achive_time",
                                    "angle",
                                    "status",
                                    "tags",
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
                  }
            },
            "required": [
                  "type"
            ]
      }
} as const