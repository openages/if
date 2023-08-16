export default {
      "TodoArchive.Item": {
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
                                    "id": {
                                          "type": "string",
                                          "maxLength": 30
                                    }
                              },
                              "required": [
                                    "achive_time",
                                    "angle_id",
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
                  }
            },
            "required": [
                  "id",
                  "type"
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
                                    "id": {
                                          "type": "string",
                                          "maxLength": 30
                                    }
                              },
                              "required": [
                                    "achive_time",
                                    "angle_id",
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
                  }
            },
            "required": [
                  "id",
                  "type"
            ]
      }
} as const