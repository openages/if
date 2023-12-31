export default {
      "Todo.Angle": {
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
      },
      "Todo.Tag": {
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
      },
      "Todo.Setting": {
            "type": "object",
            "properties": {
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
                  "desc": {
                        "type": "string"
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
                  "angles",
                  "tags",
                  "auto_archiving"
            ]
      },
      "Todo.TodoSetting": {
            "type": "object",
            "properties": {
                  "file_id": {
                        "type": "string"
                  },
                  "module": {
                        "type": "string"
                  },
                  "setting": {
                        "type": "object",
                        "properties": {
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
                              "desc": {
                                    "type": "string"
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
                              "angles",
                              "tags",
                              "auto_archiving"
                        ]
                  }
            },
            "required": [
                  "file_id",
                  "module",
                  "setting"
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
                  "open": {
                        "type": "boolean"
                  },
                  "level": {
                        "type": "number"
                  },
                  "tag_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "remind_time": {
                        "type": "number"
                  },
                  "cycle_enabled": {
                        "type": "boolean"
                  },
                  "cycle": {
                        "type": "object",
                        "properties": {
                              "scale": {
                                    "type": "string",
                                    "enum": [
                                          "minute",
                                          "hour",
                                          "day",
                                          "week",
                                          "month",
                                          "quarter",
                                          "year"
                                    ]
                              },
                              "interval": {
                                    "type": "number"
                              },
                              "exclude": {
                                    "type": "array",
                                    "items": {
                                          "type": "number"
                                    }
                              }
                        },
                        "required": [
                              "scale",
                              "interval"
                        ]
                  },
                  "recycle_time": {
                        "type": "number"
                  },
                  "remark": {
                        "type": "string"
                  },
                  "archive": {
                        "type": "boolean"
                  },
                  "archive_time": {
                        "type": "number"
                  },
                  "deadline": {
                        "type": "number"
                  },
                  "schedule": {
                        "type": "boolean"
                  },
                  "start_time": {
                        "type": "number"
                  },
                  "end_time": {
                        "type": "number"
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "id": {
                                          "type": "string"
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
                  "sort": {
                        "type": "number"
                  },
                  "create_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "angle_id",
                  "archive",
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
                  "sort": {
                        "type": "number"
                  },
                  "create_at": {
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
                  "open": {
                        "type": "boolean"
                  },
                  "level": {
                        "type": "number"
                  },
                  "tag_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "remind_time": {
                        "type": "number"
                  },
                  "cycle_enabled": {
                        "type": "boolean"
                  },
                  "cycle": {
                        "type": "object",
                        "properties": {
                              "scale": {
                                    "type": "string",
                                    "enum": [
                                          "minute",
                                          "hour",
                                          "day",
                                          "week",
                                          "month",
                                          "quarter",
                                          "year"
                                    ]
                              },
                              "interval": {
                                    "type": "number"
                              },
                              "exclude": {
                                    "type": "array",
                                    "items": {
                                          "type": "number"
                                    }
                              }
                        },
                        "required": [
                              "scale",
                              "interval"
                        ]
                  },
                  "recycle_time": {
                        "type": "number"
                  },
                  "remark": {
                        "type": "string"
                  },
                  "archive": {
                        "type": "boolean"
                  },
                  "archive_time": {
                        "type": "number"
                  },
                  "deadline": {
                        "type": "number"
                  },
                  "schedule": {
                        "type": "boolean"
                  },
                  "start_time": {
                        "type": "number"
                  },
                  "end_time": {
                        "type": "number"
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "id": {
                                          "type": "string"
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
                  "sort": {
                        "type": "number"
                  },
                  "create_at": {
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