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
                  }
            },
            "required": [
                  "id",
                  "angles",
                  "tags",
                  "auto_archiving"
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
                        ],
                        "maxLength": 12
                  },
                  "star": {
                        "type": "number"
                  },
                  "archive_time": {
                        "type": "number",
                        "multipleOf": 1,
                        "minimum": 1,
                        "maximum": 9999999999000
                  },
                  "tag_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "circle_enabled": {
                        "type": "boolean"
                  },
                  "circle_value": {
                        "type": "array",
                        "items": {
                              "type": "number"
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
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
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
                                                "unchecked"
                                          ]
                                    }
                              },
                              "required": [
                                    "id",
                                    "text",
                                    "status"
                              ]
                        }
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "text": {
                        "type": "string"
                  },
                  "create_at": {
                        "type": "number"
                  },
                  "sort": {
                        "type": "number"
                  }
            },
            "required": [
                  "angle_id",
                  "circle_enabled",
                  "create_at",
                  "file_id",
                  "id",
                  "sort",
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
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "text": {
                        "type": "string"
                  },
                  "create_at": {
                        "type": "number"
                  },
                  "sort": {
                        "type": "number"
                  }
            },
            "required": [
                  "angle_id",
                  "create_at",
                  "file_id",
                  "id",
                  "sort",
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
                        ],
                        "maxLength": 12
                  },
                  "star": {
                        "type": "number"
                  },
                  "archive_time": {
                        "type": "number",
                        "multipleOf": 1,
                        "minimum": 1,
                        "maximum": 9999999999000
                  },
                  "tag_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "circle_enabled": {
                        "type": "boolean"
                  },
                  "circle_value": {
                        "type": "array",
                        "items": {
                              "type": "number"
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
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
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
                                                "unchecked"
                                          ]
                                    }
                              },
                              "required": [
                                    "id",
                                    "text",
                                    "status"
                              ]
                        }
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "text": {
                        "type": "string"
                  },
                  "create_at": {
                        "type": "number"
                  },
                  "sort": {
                        "type": "number"
                  }
            },
            "required": [
                  "angle_id",
                  "create_at",
                  "file_id",
                  "id",
                  "sort",
                  "text",
                  "type"
            ]
      }
} as const