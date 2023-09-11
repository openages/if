export default {
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
                  "relations": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "items": {
                                          "type": "array",
                                          "items": {
                                                "type": "string"
                                          }
                                    },
                                    "checked": {
                                          "type": "boolean"
                                    }
                              },
                              "required": [
                                    "items",
                                    "checked"
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
      },
      "Todo.Todo": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "const": "todo"
                  },
                  "status": {
                        "type": "string",
                        "enum": [
                              "checked",
                              "unchecked",
                              "closed"
                        ]
                  },
                  "archive_time": {
                        "type": "number"
                  },
                  "tag_ids": {
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
                  },
                  "text": {
                        "type": "string"
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "create_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "angle_id",
                  "create_at",
                  "id",
                  "status",
                  "text",
                  "type"
            ]
      },
      "Todo.Group": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "const": "group"
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "text": {
                        "type": "string"
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "create_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "angle_id",
                  "create_at",
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
                              "todo",
                              "group"
                        ]
                  },
                  "status": {
                        "type": "string",
                        "enum": [
                              "checked",
                              "unchecked",
                              "closed"
                        ]
                  },
                  "archive_time": {
                        "type": "number"
                  },
                  "tag_ids": {
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
                  },
                  "text": {
                        "type": "string"
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "create_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "angle_id",
                  "create_at",
                  "id",
                  "text",
                  "type"
            ]
      }
} as const