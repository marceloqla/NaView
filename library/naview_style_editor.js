//TODO: Send final to Neli
//TODO: Github everything
//TODO: Generate article figures

//1

// Membranes BOX
// Helices Box
// Long Loops FIXED BULB
// N and C terminal FIXED 1 AND 2 WAVES
// Short Loops FIXED SIMPLE
// Pore Loops RESLEN 3
// TEXT ANNOTATIONS EACH DOMAIN

//2

// Membranes BOX
// Helices Cylinders
// Long Loops RESLEN 3 MUSHROOM
// N and C terminal RESLEN 3 1 AND 3 WAVES
// Short Loops RESLEN 3 SWIRL
// Pore Loops RESLEN 3
// RESID BASED COLORING RED TO BLUE

//3

// Membranes LIPID
// Helices Cartoon
// Long Loops FIXED MUSHROOM
// N and C terminal FIXED 1 AND 3 WAVES
// Short Loops SCALED BULB
// Pore Loops RESLEN 3
// RELATION 2 RESIDUES AND 2 ELEMENTS GREEN LINES SCALED TO WEIGHT

//4

// Membranes LIPID
// Helices Cartoon
// Long Loops FIXED MUSHROOM WITH 2 FOLDS
// N and C terminal FIXED 1 AND 2 WAVES
// Short Loops FIXED BULB
// Pore Loops RESLEN 3
// RELATION 2 RESIDUES (BLUE) AND 2 ELEMENTS (RED) LINES 2 PIXEL STROKE

//TODO: NaViewConsole for appending and generating color and text rules


class NaViewStyleEditor {
    constructor(naview_obj, editor_id, console_id) {
        this.naview_obj = naview_obj;
        this.editor_id = editor_id;
        this.console_id = console_id;
        this.editor_status = false;
        this.console_status = false;
        this.console_type = "text";
        this.allowclose = true;
        this.style_obj_keys_to_html = {
            "canvas": {
                "type":"dict", "title": "Canvas",
                "pad":"0px","cpad":"8px",
                "subs": {
                    "border": {
                        "type":"dict", "title": "Borders",
                        "pad":"0px","cpad":"8px",
                        "subs": {
                            "right":{"type": "float", "bounds":[0,1], "title": "Right", "default":0.02},
                            "left":{"type": "float", "bounds":[0,1], "title": "Left", "default":0.02},
                            "top":{"type": "float", "bounds":[0,1], "title": "Top", "default":0.02},
                            "bottom":{"type": "float", "bounds":[0,1], "title": "Bottom", "default":0.02},
                        }
                    }
                },
            },
            "membrane": {
                "type":"dict", "title": "Membrane",
                "pad":"0px","cpad":"8px",
                "subs": {
                    "membrane_mode":{
                        "type": "select",
                        "title": "Membrane Mode:",
                        "options": ["box", "lipid"],
                        "updatable": {
                            "type": true,
                            "select_id": "membrane>membrane_draw_opts"
                        }
                    },
                    "membrane_draw_opts": {
                        "type": "relative_dict",
                        "title": "Membrane Rendering:",
                        "pad":"0px","cpad":"8px",
                        "select_id": "membrane>membrane_mode",
                        "subs": {
                            "box":{
                                "fill": {"type": "color", "title": "Fill:", "default":"yellow"},
                                "opacity": {"type": "float", "bounds":[0,1], "title": "Opacity", "default":0.6},
                            },
                            "lipid":{
                                "hfill":{"type":"color", "title": "Head Fill:", "default":"white"},
                                "hstroke":{"type":"color", "title": "Head Stroke Fill:", "default":"black"},
                                "hstroke_s":{"type":"int","bounds":[], "title":"Head Stroke Size", "default":2},
                                "hopacity":{"type": "float", "bounds":[0,1], "title": "Head Opacity", "default":0.6},
                                "tfill":{"type":"color", "title": "Tail Fill:", "default":"black"},
                                "tstroke":{"type":"color", "title": "Tail Stroke Fill:", "default":"black"},
                                "tstroke_s":{"type":"int","bounds":[], "title":"Tail Stroke Size", "default":2},
                                "topacity":{"type": "float", "bounds":[0,1], "title": "Tail Opacity", "default":0.6},
                                "lipid_head_radius_width":{"type": "float", "bounds":[0,1], "title": "Head Radius Width", "default":0.0075},
                                "lipid_head_radius_height":{"type": "float", "bounds":[0,1], "title": "Head Radius Height", "default":0.1},
                                "lipid_tail_number":{"type":"int","bounds":[1,2], "title": "Tail Number", "default":1},
                                // "lipid_tail_breaks":{"type":"",},
                                "lipid_tail_spacing":{"type": "float", "bounds":[0,1], "title": "Head Radius Height", "default":0.001},
                            },
                        }
                    },
                    "membrane_region_height":{"type": "float", "bounds":[0,1], "title": "Membrane Height:", "default":0.4}
                },
            },
            "protein": {
                "type":"dict", "title": "Protein",
                "pad":"0px","cpad":"8px",
                "subs": {
                    "helix_mode": {
                        "type": "select",
                        "title": "Helix Mode:",
                        "options": ["box", "cylinder", "cartoon"],
                        "updatable": {
                            "type": true,
                            "select_id": "protein>helix_draw_opts"
                        }
                    },
                    "helix_draw_opts": {
                        "type": "relative_dict",
                        "title": "Helix Rendering:",
                        "pad":"0px","cpad":"8px",
                        "select_id": "protein>helix_mode",
                        "subs": {
                            "box":{
                                "fill": {
                                    "type": "composed_dict",
                                    "pad":"0px","cpad":"8px",
                                    "title": "Helix Fill Color:",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"color","title":"DI-H1","default":"red"},
                                            2:{"type":"color","title":"DI-H2","default":"red"},
                                            3:{"type":"color","title":"DI-H3","default":"red"},
                                            4:{"type":"color","title":"DI-H4","default":"red"},
                                            5:{"type":"color","title":"DI-H5","default":"red"},
                                            6:{"type":"color","title":"DI-H6","default":"red"}
                                        },
                                        "II":{
                                            1:{"type":"color","title":"DII-H1","default":"red"},
                                            2:{"type":"color","title":"DII-H2","default":"red"},
                                            3:{"type":"color","title":"DII-H3","default":"red"},
                                            4:{"type":"color","title":"DII-H4","default":"red"},
                                            5:{"type":"color","title":"DII-H5","default":"red"},
                                            6:{"type":"color","title":"DII-H6","default":"red"}
                                        },
                                        "III":{
                                            1:{"type":"color","title":"DIII-H1","default":"red"},
                                            2:{"type":"color","title":"DIII-H2","default":"red"},
                                            3:{"type":"color","title":"DIII-H3","default":"red"},
                                            4:{"type":"color","title":"DIII-H4","default":"red"},
                                            5:{"type":"color","title":"DIII-H5","default":"red"},
                                            6:{"type":"color","title":"DIII-H6","default":"red"}
                                        },
                                        "IV":{
                                            1:{"type":"color","title":"DIV-H1","default":"red"},
                                            2:{"type":"color","title":"DIV-H2","default":"red"},
                                            3:{"type":"color","title":"DIV-H3","default":"red"},
                                            4:{"type":"color","title":"DIV-H4","default":"red"},
                                            5:{"type":"color","title":"DIV-H5","default":"red"},
                                            6:{"type":"color","title":"DIV-H6","default":"red"}
                                        }
                                    }
                                },
                                "stroke": {
                                    "type": "composed_dict",
                                    "title": "Helix Stroke Color:",
                                    "pad":"0px","cpad":"8px",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"color","title":"DI-H1","default":"red"},
                                            2:{"type":"color","title":"DI-H2","default":"red"},
                                            3:{"type":"color","title":"DI-H3","default":"red"},
                                            4:{"type":"color","title":"DI-H4","default":"red"},
                                            5:{"type":"color","title":"DI-H5","default":"red"},
                                            6:{"type":"color","title":"DI-H6","default":"red"}
                                        },
                                        "II":{
                                            1:{"type":"color","title":"DII-H1","default":"red"},
                                            2:{"type":"color","title":"DII-H2","default":"red"},
                                            3:{"type":"color","title":"DII-H3","default":"red"},
                                            4:{"type":"color","title":"DII-H4","default":"red"},
                                            5:{"type":"color","title":"DII-H5","default":"red"},
                                            6:{"type":"color","title":"DII-H6","default":"red"}
                                        },
                                        "III":{
                                            1:{"type":"color","title":"DIII-H1","default":"red"},
                                            2:{"type":"color","title":"DIII-H2","default":"red"},
                                            3:{"type":"color","title":"DIII-H3","default":"red"},
                                            4:{"type":"color","title":"DIII-H4","default":"red"},
                                            5:{"type":"color","title":"DIII-H5","default":"red"},
                                            6:{"type":"color","title":"DIII-H6","default":"red"}
                                        },
                                        "IV":{
                                            1:{"type":"color","title":"DIV-H1","default":"red"},
                                            2:{"type":"color","title":"DIV-H2","default":"red"},
                                            3:{"type":"color","title":"DIV-H3","default":"red"},
                                            4:{"type":"color","title":"DIV-H4","default":"red"},
                                            5:{"type":"color","title":"DIV-H5","default":"red"},
                                            6:{"type":"color","title":"DIV-H6","default":"red"}
                                        }
                                    }
                                },
                                "stroke_size": {
                                    "type": "composed_dict",
                                    "title": "Helix Stroke Size:",
                                    "pad":"0px","cpad":"8px",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                        "II":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                        "III":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                        "IV":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                    }
                                },
                                "opacity": {
                                    "type": "composed_dict",
                                    "pad":"0px","cpad":"8px",
                                    "title": "Helix opacity",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                        "II":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                        "III":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                        "IV":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                    }
                                },

                            },
                            "cylinder":{
                                "fill": {
                                    "type": "composed_dict",
                                    "pad":"0px","cpad":"8px",
                                    "title": "Helix Fill Color:",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"color","title":"DI-H1","default":"red"},
                                            2:{"type":"color","title":"DI-H2","default":"red"},
                                            3:{"type":"color","title":"DI-H3","default":"red"},
                                            4:{"type":"color","title":"DI-H4","default":"red"},
                                            5:{"type":"color","title":"DI-H5","default":"red"},
                                            6:{"type":"color","title":"DI-H6","default":"red"}
                                        },
                                        "II":{
                                            1:{"type":"color","title":"DII-H1","default":"red"},
                                            2:{"type":"color","title":"DII-H2","default":"red"},
                                            3:{"type":"color","title":"DII-H3","default":"red"},
                                            4:{"type":"color","title":"DII-H4","default":"red"},
                                            5:{"type":"color","title":"DII-H5","default":"red"},
                                            6:{"type":"color","title":"DII-H6","default":"red"}
                                        },
                                        "III":{
                                            1:{"type":"color","title":"DIII-H1","default":"red"},
                                            2:{"type":"color","title":"DIII-H2","default":"red"},
                                            3:{"type":"color","title":"DIII-H3","default":"red"},
                                            4:{"type":"color","title":"DIII-H4","default":"red"},
                                            5:{"type":"color","title":"DIII-H5","default":"red"},
                                            6:{"type":"color","title":"DIII-H6","default":"red"}
                                        },
                                        "IV":{
                                            1:{"type":"color","title":"DIV-H1","default":"red"},
                                            2:{"type":"color","title":"DIV-H2","default":"red"},
                                            3:{"type":"color","title":"DIV-H3","default":"red"},
                                            4:{"type":"color","title":"DIV-H4","default":"red"},
                                            5:{"type":"color","title":"DIV-H5","default":"red"},
                                            6:{"type":"color","title":"DIV-H6","default":"red"}
                                        }
                                    }
                                },
                                "stroke": {
                                    "type": "composed_dict",
                                    "pad":"0px","cpad":"8px",
                                    "title": "Helix Stroke Color:",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"color","title":"DI-H1","default":"red"},
                                            2:{"type":"color","title":"DI-H2","default":"red"},
                                            3:{"type":"color","title":"DI-H3","default":"red"},
                                            4:{"type":"color","title":"DI-H4","default":"red"},
                                            5:{"type":"color","title":"DI-H5","default":"red"},
                                            6:{"type":"color","title":"DI-H6","default":"red"}
                                        },
                                        "II":{
                                            1:{"type":"color","title":"DII-H1","default":"red"},
                                            2:{"type":"color","title":"DII-H2","default":"red"},
                                            3:{"type":"color","title":"DII-H3","default":"red"},
                                            4:{"type":"color","title":"DII-H4","default":"red"},
                                            5:{"type":"color","title":"DII-H5","default":"red"},
                                            6:{"type":"color","title":"DII-H6","default":"red"}
                                        },
                                        "III":{
                                            1:{"type":"color","title":"DIII-H1","default":"red"},
                                            2:{"type":"color","title":"DIII-H2","default":"red"},
                                            3:{"type":"color","title":"DIII-H3","default":"red"},
                                            4:{"type":"color","title":"DIII-H4","default":"red"},
                                            5:{"type":"color","title":"DIII-H5","default":"red"},
                                            6:{"type":"color","title":"DIII-H6","default":"red"}
                                        },
                                        "IV":{
                                            1:{"type":"color","title":"DIV-H1","default":"red"},
                                            2:{"type":"color","title":"DIV-H2","default":"red"},
                                            3:{"type":"color","title":"DIV-H3","default":"red"},
                                            4:{"type":"color","title":"DIV-H4","default":"red"},
                                            5:{"type":"color","title":"DIV-H5","default":"red"},
                                            6:{"type":"color","title":"DIV-H6","default":"red"}
                                        }
                                    }
                                },
                                "stroke_size": {
                                    "type": "composed_dict",
                                    "pad":"0px","cpad":"8px",
                                    "title": "Helix Stroke Size:",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                        "II":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                        "III":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                        "IV":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                    }
                                },
                                "opacity": {
                                    "type": "composed_dict",
                                    "pad":"0px","cpad":"8px",
                                    "title": "Helix opacity",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                        "II":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                        "III":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                        "IV":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                    }
                                },
                                "top_cylinder_stroke": {"type":"color","title":"Top Cyl Str Color","default":"black"},
                                "top_cylinder_stroke_size": {"type":"float","title":"Top Cyl Str Size","bounds":[],"default":1},
                                "bottom_cylinder_stroke": {"type":"color","title":"Bottom Cyl Str Color","default":"black"},
                                "bottom_cylinder_stroke_size": {"type":"float","title":"Bottom Cyl Str Size","bounds":[],"default":1},
                            },
                            "cartoon":{
                                "fill": {
                                    "type": "composed_dict",
                                    "pad":"0px","cpad":"8px",
                                    "title": "Front Helix Turn Fill Color:",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"color","title":"DI-H1","default":"red"},
                                            2:{"type":"color","title":"DI-H2","default":"red"},
                                            3:{"type":"color","title":"DI-H3","default":"red"},
                                            4:{"type":"color","title":"DI-H4","default":"red"},
                                            5:{"type":"color","title":"DI-H5","default":"red"},
                                            6:{"type":"color","title":"DI-H6","default":"red"}
                                        },
                                        "II":{
                                            1:{"type":"color","title":"DII-H1","default":"red"},
                                            2:{"type":"color","title":"DII-H2","default":"red"},
                                            3:{"type":"color","title":"DII-H3","default":"red"},
                                            4:{"type":"color","title":"DII-H4","default":"red"},
                                            5:{"type":"color","title":"DII-H5","default":"red"},
                                            6:{"type":"color","title":"DII-H6","default":"red"}
                                        },
                                        "III":{
                                            1:{"type":"color","title":"DIII-H1","default":"red"},
                                            2:{"type":"color","title":"DIII-H2","default":"red"},
                                            3:{"type":"color","title":"DIII-H3","default":"red"},
                                            4:{"type":"color","title":"DIII-H4","default":"red"},
                                            5:{"type":"color","title":"DIII-H5","default":"red"},
                                            6:{"type":"color","title":"DIII-H6","default":"red"}
                                        },
                                        "IV":{
                                            1:{"type":"color","title":"DIV-H1","default":"red"},
                                            2:{"type":"color","title":"DIV-H2","default":"red"},
                                            3:{"type":"color","title":"DIV-H3","default":"red"},
                                            4:{"type":"color","title":"DIV-H4","default":"red"},
                                            5:{"type":"color","title":"DIV-H5","default":"red"},
                                            6:{"type":"color","title":"DIV-H6","default":"red"}
                                        }
                                    }
                                },
                                "back_fill": {
                                    "type": "composed_dict",
                                    "pad":"0px","cpad":"8px",
                                    "title": "Back Helix Turn Fill Color:",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"color","title":"DI-H1","default":"salmon"},
                                            2:{"type":"color","title":"DI-H2","default":"salmon"},
                                            3:{"type":"color","title":"DI-H3","default":"salmon"},
                                            4:{"type":"color","title":"DI-H4","default":"salmon"},
                                            5:{"type":"color","title":"DI-H5","default":"salmon"},
                                            6:{"type":"color","title":"DI-H6","default":"salmon"}
                                        },
                                        "II":{
                                            1:{"type":"color","title":"DII-H1","default":"salmon"},
                                            2:{"type":"color","title":"DII-H2","default":"salmon"},
                                            3:{"type":"color","title":"DII-H3","default":"salmon"},
                                            4:{"type":"color","title":"DII-H4","default":"salmon"},
                                            5:{"type":"color","title":"DII-H5","default":"salmon"},
                                            6:{"type":"color","title":"DII-H6","default":"salmon"}
                                        },
                                        "III":{
                                            1:{"type":"color","title":"DIII-H1","default":"salmon"},
                                            2:{"type":"color","title":"DIII-H2","default":"salmon"},
                                            3:{"type":"color","title":"DIII-H3","default":"salmon"},
                                            4:{"type":"color","title":"DIII-H4","default":"salmon"},
                                            5:{"type":"color","title":"DIII-H5","default":"salmon"},
                                            6:{"type":"color","title":"DIII-H6","default":"salmon"}
                                        },
                                        "IV":{
                                            1:{"type":"color","title":"DIV-H1","default":"salmon"},
                                            2:{"type":"color","title":"DIV-H2","default":"salmon"},
                                            3:{"type":"color","title":"DIV-H3","default":"salmon"},
                                            4:{"type":"color","title":"DIV-H4","default":"salmon"},
                                            5:{"type":"color","title":"DIV-H5","default":"salmon"},
                                            6:{"type":"color","title":"DIV-H6","default":"salmon"}
                                        }
                                    }
                                },
                                "stroke": {
                                    "type": "composed_dict",
                                    "pad":"0px","cpad":"8px",
                                    "title": "Helix Stroke Color:",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"color","title":"DI-H1","default":"red"},
                                            2:{"type":"color","title":"DI-H2","default":"red"},
                                            3:{"type":"color","title":"DI-H3","default":"red"},
                                            4:{"type":"color","title":"DI-H4","default":"red"},
                                            5:{"type":"color","title":"DI-H5","default":"red"},
                                            6:{"type":"color","title":"DI-H6","default":"red"}
                                        },
                                        "II":{
                                            1:{"type":"color","title":"DII-H1","default":"red"},
                                            2:{"type":"color","title":"DII-H2","default":"red"},
                                            3:{"type":"color","title":"DII-H3","default":"red"},
                                            4:{"type":"color","title":"DII-H4","default":"red"},
                                            5:{"type":"color","title":"DII-H5","default":"red"},
                                            6:{"type":"color","title":"DII-H6","default":"red"}
                                        },
                                        "III":{
                                            1:{"type":"color","title":"DIII-H1","default":"red"},
                                            2:{"type":"color","title":"DIII-H2","default":"red"},
                                            3:{"type":"color","title":"DIII-H3","default":"red"},
                                            4:{"type":"color","title":"DIII-H4","default":"red"},
                                            5:{"type":"color","title":"DIII-H5","default":"red"},
                                            6:{"type":"color","title":"DIII-H6","default":"red"}
                                        },
                                        "IV":{
                                            1:{"type":"color","title":"DIV-H1","default":"red"},
                                            2:{"type":"color","title":"DIV-H2","default":"red"},
                                            3:{"type":"color","title":"DIV-H3","default":"red"},
                                            4:{"type":"color","title":"DIV-H4","default":"red"},
                                            5:{"type":"color","title":"DIV-H5","default":"red"},
                                            6:{"type":"color","title":"DIV-H6","default":"red"}
                                        }
                                    }
                                },
                                "stroke_size": {
                                    "type": "composed_dict",
                                    "pad":"0px","cpad":"8px",
                                    "title": "Helix Stroke Size:",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                        "II":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                        "III":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                        "IV":{
                                            1:{"type":"int","bounds":[],"title":"DI-H1","default":2},
                                            2:{"type":"int","bounds":[],"title":"DI-H2","default":2},
                                            3:{"type":"int","bounds":[],"title":"DI-H3","default":2},
                                            4:{"type":"int","bounds":[],"title":"DI-H4","default":2},
                                            5:{"type":"int","bounds":[],"title":"DI-H5","default":2},
                                            6:{"type":"int","bounds":[],"title":"DI-H6","default":2}
                                        },
                                    }
                                },
                                "opacity": {
                                    "type": "composed_dict",
                                    "pad":"0px","cpad":"8px",
                                    "title": "Helix opacity",
                                    "depth":2,
                                    "subs": {
                                        "I":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                        "II":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                        "III":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                        "IV":{
                                            1:{"type":"float","bounds":[0,1],"title":"DI-H1","default":1},
                                            2:{"type":"float","bounds":[0,1],"title":"DI-H2","default":1},
                                            3:{"type":"float","bounds":[0,1],"title":"DI-H3","default":1},
                                            4:{"type":"float","bounds":[0,1],"title":"DI-H4","default":1},
                                            5:{"type":"float","bounds":[0,1],"title":"DI-H5","default":1},
                                            6:{"type":"float","bounds":[0,1],"title":"DI-H6","default":1}
                                        },
                                    }
                                },
                                "x_to_end_prop": {"type":"float","title":"Turn X Prop","bounds":[0,1],"default":1/20},
                                "y_to_mid_prop": {"type":"float","title":"Turn Y Prop","bounds":[0,1],"default":1/7},
                                "aa_area_perc_displacement": {"type":"float","title":"Turn AA Disp","bounds":[0,1],"default":0.1},
                                "thickness": {"type":"float","title":"Turn Thickness","bounds":[],"default":0.55},
                                "front_helix_stroke":{"type":"color","title":"Front Helix Stroke", "default":'black'},
                                "back_helix_stroke": {"type":"color","title":"Back Helix Stroke", "default":'black'},
                                "stroke_size": {"type":"float","title":"Turn Stroke Size","bounds":[],"default":1.5},

                            },
                        }
                    },
                    "helix_region_width": {
                        "type": "composed_dict",
                        "pad":"0px","cpad":"8px",
                        "title":"Helix Widths:",
                        "depth": 2,
                        "subs": {
                            "I":{
                                0:{"type": "float", "bounds":[0,1], "title":"DI-H1","default":0.02},
                                1:{"type": "float", "bounds":[0,1], "title":"DI-H2","default":0.02},
                                2:{"type": "float", "bounds":[0,1], "title":"DI-H3","default":0.02},
                                3:{"type": "float", "bounds":[0,1], "title":"DI-H4","default":0.02},
                                4:{"type": "float", "bounds":[0,1], "title":"DI-H5","default":0.02},
                                5:{"type": "float", "bounds":[0,1], "title":"DI-H6","default":0.02},
                            },
                            "II":{
                                0:{"type": "float", "bounds":[0,1], "title":"DII-H1","default":0.02},
                                1:{"type": "float", "bounds":[0,1], "title":"DII-H2","default":0.02},
                                2:{"type": "float", "bounds":[0,1], "title":"DII-H3","default":0.02},
                                3:{"type": "float", "bounds":[0,1], "title":"DII-H4","default":0.02},
                                4:{"type": "float", "bounds":[0,1], "title":"DII-H5","default":0.02},
                                5:{"type": "float", "bounds":[0,1], "title":"DII-H6","default":0.02},
                            },
                            "III":{
                                0:{"type": "float", "bounds":[0,1], "title":"DIII-H1","default":0.02},
                                1:{"type": "float", "bounds":[0,1], "title":"DIII-H2","default":0.02},
                                2:{"type": "float", "bounds":[0,1], "title":"DIII-H3","default":0.02},
                                3:{"type": "float", "bounds":[0,1], "title":"DIII-H4","default":0.02},
                                4:{"type": "float", "bounds":[0,1], "title":"DIII-H5","default":0.02},
                                5:{"type": "float", "bounds":[0,1], "title":"DIII-H6","default":0.02},
                            },
                            "IV":{
                                0:{"type": "float", "bounds":[0,1], "title":"DIV-H1","default":0.02},
                                1:{"type": "float", "bounds":[0,1], "title":"DIV-H2","default":0.02},
                                2:{"type": "float", "bounds":[0,1], "title":"DIV-H3","default":0.02},
                                3:{"type": "float", "bounds":[0,1], "title":"DIV-H4","default":0.02},
                                4:{"type": "float", "bounds":[0,1], "title":"DIV-H5","default":0.02},
                                5:{"type": "float", "bounds":[0,1], "title":"DIV-H6","default":0.02},
                            }
                        }
                    },
                    "helix_region_height": {
                        "type": "composed_dict",
                        "pad":"0px","cpad":"8px",
                        "title":"Helix Heights:",
                        "depth": 2,
                        "subs": {
                            "I":{
                                0:{"type": "float", "bounds":[0,1], "title":"DI-H1","default":0.4},
                                1:{"type": "float", "bounds":[0,1], "title":"DI-H2","default":0.4},
                                2:{"type": "float", "bounds":[0,1], "title":"DI-H3","default":0.4},
                                3:{"type": "float", "bounds":[0,1], "title":"DI-H4","default":0.4},
                                4:{"type": "float", "bounds":[0,1], "title":"DI-H5","default":0.4},
                                5:{"type": "float", "bounds":[0,1], "title":"DI-H6","default":0.4},
                            },
                            "II":{
                                0:{"type": "float", "bounds":[0,1], "title":"DII-H1","default":0.4},
                                1:{"type": "float", "bounds":[0,1], "title":"DII-H2","default":0.4},
                                2:{"type": "float", "bounds":[0,1], "title":"DII-H3","default":0.4},
                                3:{"type": "float", "bounds":[0,1], "title":"DII-H4","default":0.4},
                                4:{"type": "float", "bounds":[0,1], "title":"DII-H5","default":0.4},
                                5:{"type": "float", "bounds":[0,1], "title":"DII-H6","default":0.4},
                            },
                            "III":{
                                0:{"type": "float", "bounds":[0,1], "title":"DIII-H1","default":0.4},
                                1:{"type": "float", "bounds":[0,1], "title":"DIII-H2","default":0.4},
                                2:{"type": "float", "bounds":[0,1], "title":"DIII-H3","default":0.4},
                                3:{"type": "float", "bounds":[0,1], "title":"DIII-H4","default":0.4},
                                4:{"type": "float", "bounds":[0,1], "title":"DIII-H5","default":0.4},
                                5:{"type": "float", "bounds":[0,1], "title":"DIII-H6","default":0.4},
                            },
                            "IV":{
                                0:{"type": "float", "bounds":[0,1], "title":"DIV-H1","default":0.4},
                                1:{"type": "float", "bounds":[0,1], "title":"DIV-H2","default":0.4},
                                2:{"type": "float", "bounds":[0,1], "title":"DIV-H3","default":0.4},
                                3:{"type": "float", "bounds":[0,1], "title":"DIV-H4","default":0.4},
                                4:{"type": "float", "bounds":[0,1], "title":"DIV-H5","default":0.4},
                                5:{"type": "float", "bounds":[0,1], "title":"DIV-H6","default":0.4},
                            }
                        }
                    },
                    "helix_spacing_width": {
                        "type": "composed_dict",
                        "pad":"0px","cpad":"8px",
                        "title":"Helix Spacing Widths:",
                        "depth": 2,
                        "subs": {
                            "I":{
                                0:{"type": "int", "bounds":[], "title":"DI-H1","default":5},
                                1:{"type": "int", "bounds":[], "title":"DI-H2","default":5},
                                2:{"type": "int", "bounds":[], "title":"DI-H3","default":5},
                                3:{"type": "int", "bounds":[], "title":"DI-H4","default":5},
                                4:{"type": "int", "bounds":[], "title":"DI-H5","default":5},
                                5:{"type": "int", "bounds":[], "title":"DI-H6","default":5},
                            },
                            "II":{
                                0:{"type": "int", "bounds":[], "title":"DII-H1","default":5},
                                1:{"type": "int", "bounds":[], "title":"DII-H2","default":5},
                                2:{"type": "int", "bounds":[], "title":"DII-H3","default":5},
                                3:{"type": "int", "bounds":[], "title":"DII-H4","default":5},
                                4:{"type": "int", "bounds":[], "title":"DII-H5","default":5},
                                5:{"type": "int", "bounds":[], "title":"DII-H6","default":5},
                            },
                            "III":{
                                0:{"type": "int", "bounds":[], "title":"DIII-H1","default":5},
                                1:{"type": "int", "bounds":[], "title":"DIII-H2","default":5},
                                2:{"type": "int", "bounds":[], "title":"DIII-H3","default":5},
                                3:{"type": "int", "bounds":[], "title":"DIII-H4","default":5},
                                4:{"type": "int", "bounds":[], "title":"DIII-H5","default":5},
                                5:{"type": "int", "bounds":[], "title":"DIII-H6","default":5},
                            },
                            "IV":{
                                0:{"type": "int", "bounds":[], "title":"DIV-H1","default":5},
                                1:{"type": "int", "bounds":[], "title":"DIV-H2","default":5},
                                2:{"type": "int", "bounds":[], "title":"DIV-H3","default":5},
                                3:{"type": "int", "bounds":[], "title":"DIV-H4","default":5},
                                4:{"type": "int", "bounds":[], "title":"DIV-H5","default":5},
                                5:{"type": "int", "bounds":[], "title":"DIV-H6","default":5},
                            }
                        }
                    },
                    "short_loops_draw_opts": {
                        "type": "dict", "title": "Short Loops Rendering",
                        "pad":"0px","cpad":"8px",
                        "subs": {
                            "type":"skip",
                            "fill":"skip",
                            "stroke": {"type":"color", "title": "S-Loop Stroke Fill:", "default":"black"},
                            "opacity": {"type": "float", "bounds":[0,1], "title": "S-Loop Opacity", "default":1},
                            "stroke_size": {"type":"int","bounds":[], "title":"S-Loop Stroke Size", "default":3},
                            "calc_len": {
                                "type":"dict", "title":"Length Calc.",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":{
                                        "type": "select",
                                        "title": "Calc Mode:",
                                        "options": ["fixed", "custom", "scaled", "reslen"],
                                        "updatable": {
                                            "type": true,
                                            "select_id": "protein>short_loops_draw_opts>calc_len>calc"
                                        }
                                    },
                                    "calc":{
                                        "type": "relative_dict",
                                        "pad":"0px","cpad":"8px",
                                        "title": "Calc Options:",
                                        "select_id": "protein>short_loops_draw_opts>calc_len>type",
                                        "subs": {
                                            //TODO: fix these to style obj
                                            "fixed":{
                                                "height":{"type":"float", "bounds":[0,1], "title":"S-Loop Height", "default": 0.1},
                                                "width":{"type":"float", "bounds":[0,1], "title":"S-Loop Width", "default": 0.0025},
                                            },
                                            "scaled": {
                                                "height":{"type":"float", "bounds":[0,1], "title":"S-Loop max Height", "default": 0.1},
                                                "width":{"type":"float", "bounds":[0,1], "title":"S-Loop max Width", "default": 0.0025},
                                                "scale": {
                                                    "type": "select",
                                                    "title": "S-Loop Scale Type",
                                                    "options": ["linear", "power", "log"],
                                                    "updatable": {
                                                        "type": false,
                                                    }
                                                },
                                                "exponent":{"type":"int","bounds":[], "title":"Power Scale exponent", "default":2},
                                                "base":{"type":"int","bounds":[], "title":"Log Scale base", "default":10},
                                            },
                                            "reslen": {
                                                "length":{"type":"int","bounds":[], "title":"S-Loop Length", "default":2},
                                            },
                                            "custom": {
                                                "width": {
                                                    "type": "composed_dict",
                                                    "title":"Short-Loop Widths:",
                                                    "pad":"0px","cpad":"8px",
                                                    "depth": 2,
                                                    "subs": {
                                                        "I":{
                                                            0:{"type": "float", "bounds":[0,1], "title":"DI-SL1","default":0.01},
                                                            1:{"type": "float", "bounds":[0,1], "title":"DI-SL2","default":0.01},
                                                            2:{"type": "float", "bounds":[0,1], "title":"DI-SL3","default":0.01},
                                                            3:{"type": "float", "bounds":[0,1], "title":"DI-SL4","default":0.01},
                                                            4:{"type": "float", "bounds":[0,1], "title":"DI-SL5","default":0.01},
                                                            5:{"type": "float", "bounds":[0,1], "title":"DI-SL6","default":0.01},
                                                            6:{"type": "float", "bounds":[0,1], "title":"DI-SL7","default":0.01},
                                                        },"II":{
                                                            0:{"type": "float", "bounds":[0,1], "title":"DI-SL1","default":0.01},
                                                            1:{"type": "float", "bounds":[0,1], "title":"DI-SL2","default":0.01},
                                                            2:{"type": "float", "bounds":[0,1], "title":"DI-SL3","default":0.01},
                                                            3:{"type": "float", "bounds":[0,1], "title":"DI-SL4","default":0.01},
                                                            4:{"type": "float", "bounds":[0,1], "title":"DI-SL5","default":0.01},
                                                            5:{"type": "float", "bounds":[0,1], "title":"DI-SL6","default":0.01},
                                                            6:{"type": "float", "bounds":[0,1], "title":"DI-SL7","default":0.01},
                                                        },"III":{
                                                            0:{"type": "float", "bounds":[0,1], "title":"DI-SL1","default":0.01},
                                                            1:{"type": "float", "bounds":[0,1], "title":"DI-SL2","default":0.01},
                                                            2:{"type": "float", "bounds":[0,1], "title":"DI-SL3","default":0.01},
                                                            3:{"type": "float", "bounds":[0,1], "title":"DI-SL4","default":0.01},
                                                            4:{"type": "float", "bounds":[0,1], "title":"DI-SL5","default":0.01},
                                                            5:{"type": "float", "bounds":[0,1], "title":"DI-SL6","default":0.01},
                                                            6:{"type": "float", "bounds":[0,1], "title":"DI-SL7","default":0.01},
                                                        },"IV":{
                                                            0:{"type": "float", "bounds":[0,1], "title":"DI-SL1","default":0.01},
                                                            1:{"type": "float", "bounds":[0,1], "title":"DI-SL2","default":0.01},
                                                            2:{"type": "float", "bounds":[0,1], "title":"DI-SL3","default":0.01},
                                                            3:{"type": "float", "bounds":[0,1], "title":"DI-SL4","default":0.01},
                                                            4:{"type": "float", "bounds":[0,1], "title":"DI-SL5","default":0.01},
                                                            5:{"type": "float", "bounds":[0,1], "title":"DI-SL6","default":0.01},
                                                            6:{"type": "float", "bounds":[0,1], "title":"DI-SL7","default":0.01},
                                                        },
                                                    }
                                                },
                                                "height": {
                                                    "type": "composed_dict",
                                                    "title":"Short-Loop Heights:",
                                                    "pad":"0px","cpad":"8px",
                                                    "depth": 2,
                                                    "subs": {
                                                        "I":{
                                                            0:{"type": "float", "bounds":[0,1], "title":"DI-SL1","default":0.1},
                                                            1:{"type": "float", "bounds":[0,1], "title":"DI-SL2","default":0.1},
                                                            2:{"type": "float", "bounds":[0,1], "title":"DI-SL3","default":0.1},
                                                            3:{"type": "float", "bounds":[0,1], "title":"DI-SL4","default":0.1},
                                                            4:{"type": "float", "bounds":[0,1], "title":"DI-SL5","default":0.1},
                                                            5:{"type": "float", "bounds":[0,1], "title":"DI-SL6","default":0.1},
                                                            6:{"type": "float", "bounds":[0,1], "title":"DI-SL7","default":0.1},
                                                        },"II":{
                                                            0:{"type": "float", "bounds":[0,1], "title":"DI-SL1","default":0.1},
                                                            1:{"type": "float", "bounds":[0,1], "title":"DI-SL2","default":0.1},
                                                            2:{"type": "float", "bounds":[0,1], "title":"DI-SL3","default":0.1},
                                                            3:{"type": "float", "bounds":[0,1], "title":"DI-SL4","default":0.1},
                                                            4:{"type": "float", "bounds":[0,1], "title":"DI-SL5","default":0.1},
                                                            5:{"type": "float", "bounds":[0,1], "title":"DI-SL6","default":0.1},
                                                            6:{"type": "float", "bounds":[0,1], "title":"DI-SL7","default":0.1},
                                                        },"III":{
                                                            0:{"type": "float", "bounds":[0,1], "title":"DI-SL1","default":0.1},
                                                            1:{"type": "float", "bounds":[0,1], "title":"DI-SL2","default":0.1},
                                                            2:{"type": "float", "bounds":[0,1], "title":"DI-SL3","default":0.1},
                                                            3:{"type": "float", "bounds":[0,1], "title":"DI-SL4","default":0.1},
                                                            4:{"type": "float", "bounds":[0,1], "title":"DI-SL5","default":0.1},
                                                            5:{"type": "float", "bounds":[0,1], "title":"DI-SL6","default":0.1},
                                                            6:{"type": "float", "bounds":[0,1], "title":"DI-SL7","default":0.1},
                                                        },"IV":{
                                                            0:{"type": "float", "bounds":[0,1], "title":"DI-SL1","default":0.1},
                                                            1:{"type": "float", "bounds":[0,1], "title":"DI-SL2","default":0.1},
                                                            2:{"type": "float", "bounds":[0,1], "title":"DI-SL3","default":0.1},
                                                            3:{"type": "float", "bounds":[0,1], "title":"DI-SL4","default":0.1},
                                                            4:{"type": "float", "bounds":[0,1], "title":"DI-SL5","default":0.1},
                                                            5:{"type": "float", "bounds":[0,1], "title":"DI-SL6","default":0.1},
                                                            6:{"type": "float", "bounds":[0,1], "title":"DI-SL7","default":0.1},
                                                        },
                                                    }
                                                }
                                            }
                                        }
                                    },
                                }
                            },
                            "shape": {
                                "type":"dict", "title":"Loop Shape:",
                                "pad":"0px","cpad":"8px",
                                "child_centering":"right",
                                "subs": {
                                    "type":{
                                        "type": "select",
                                        "title": "Shape Type:",
                                        "options": ["simple", "swirl", "bulb", "mushroom"],
                                        "updatable": {
                                            "type": true,
                                            "select_id": "protein>short_loops_draw_opts>shape>calc"
                                        }
                                    },
                                    "calc":{
                                        "type": "relative_dict",
                                        "title": "Shape Calc:",
                                        "pad":"0px","cpad":"8px",
                                        "select_id": "protein>short_loops_draw_opts>shape>type",
                                        "subs": {
                                            "simple":{
                                                "y_step":{"type": "float", "bounds":[], "title": "Y step:", "default":0.5},
                                            },
                                            "swirl":{
                                                "y_step":{"type": "float", "bounds":[], "title": "Y step:", "default":0.5},
                                                "perc_step_y":{"type": "float", "bounds":[0,1], "title": "Perc Y step:", "default":0.5},
                                                "swirl_x":{"type": "float", "bounds":[], "title": "X Swirl:", "default":1},
                                            },
                                            "bulb": {
                                                "y_step":{"type": "float", "bounds":[], "title": "Y step:", "default":0.5},
                                                "perc_step_y":{"type": "float", "bounds":[0,1], "title": "Perc Y step:", "default":0.5},
                                                "x_step":{"type": "float", "bounds":[], "title": "X step:", "default":0.5},
                                            },
                                            "mushroom": {
                                                "y_step":{"type": "float", "bounds":[], "title": "Y step:", "default":0.5},
                                                "perc_step_y1":{"type": "float", "bounds":[0,1], "title": "Perc Y1 step:", "default":0.1},
                                                "perc_step_y2":{"type": "float", "bounds":[0,1], "title": "Perc Y2 step:", "default":0.5},
                                                "x_step":{"type": "float", "bounds":[], "title": "X step:", "default":0.5},
                                                "perc_center_x":{"type": "float", "bounds":[0,1], "title": "Perc X center:", "default":0.7},
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "pore_loops_draw_opts": {
                        "type": "dict", "title": "Pore Loops Rendering",
                        "pad":"0px","cpad":"8px",
                        "subs": {
                            "type":"skip",
                            "fill":"skip",
                            "stroke": {"type":"color", "title": "P-Loop Stroke Fill:", "default":"black"},
                            "opacity": {"type": "float", "bounds":[0,1], "title": "P-Loop Opacity", "default":1},
                            "stroke_size": {"type":"int","bounds":[], "title":"P-Loop Stroke Size", "default":3},
                            "calc_len": {
                                "type":"dict", "title":"Length Calc.",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":{
                                        "type": "select",
                                        "title": "Calc Mode:",
                                        "options": ["fixed", "scaled", "reslen"],
                                        "updatable": {
                                            "type": true,
                                            "select_id": "protein>pore_loops_draw_opts>calc_len>calc"
                                        }
                                    },
                                    "calc":{
                                        "type": "relative_dict",
                                        "pad":"0px","cpad":"8px",
                                        "title": "Calc Opts:",
                                        "select_id": "protein>pore_loops_draw_opts>calc_len>type",
                                        "subs": {
                                            "fixed":{
                                                "height":{"type":"float", "bounds":[0,1], "title":"P-Loop Height", "default": 0.1},
                                                "width":{"type":"float", "bounds":[0,1], "title":"P-Loop Width", "default": 0.0025},
                                            },
                                            "scaled": {
                                                "height":{"type":"float", "bounds":[0,1], "title":"P-Loop max Height", "default": 0.1},
                                                "width":{"type":"float", "bounds":[0,1], "title":"P-Loop max Width", "default": 0.0025},
                                                "scale": {
                                                    "type": "select",
                                                    "title": "P-Loop Scale Type",
                                                    "options": ["linear", "power", "log"],
                                                    "updatable": {
                                                        "type": false,
                                                    }
                                                },
                                                "exponent":{"type":"int","bounds":[], "title":"Power Scale exponent", "default":2},
                                                "base":{"type":"int","bounds":[], "title":"Log Scale base", "default":10},
                                            },
                                            "reslen": {
                                                "length":{"type":"int","bounds":[], "title":"P-Loop Length", "default":2},
                                            }
                                        }
                                    },
                                }
                            },
                            "shape": {
                                "type":"dict", "title":"Loop Shape:",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":"skip",
                                    "calc":{
                                        "type": "dict", "title":"Loop Shape Calc:",
                                        "pad":"0px","cpad":"8px",
                                        "subs": {
                                            "y_step":{"type": "float", "bounds":[], "title": "Y step:", "default":0.5},
                                            "perc_center_x":{"type": "float", "bounds":[0,1], "title": "Perc X Center:", "default":0},
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "pore_region_width": {
                        "type": "composed_dict",
                        "pad":"0px","cpad":"8px",
                        "title":"Pore-Loop Area Width:",
                        "depth": 1,
                        "subs": {
                            "I":{"type": "float", "bounds":[0,1], "title": "DI-P", "default":0.01},
                            "II":{"type": "float", "bounds":[0,1], "title": "DI-P", "default":0.01},
                            "III":{"type": "float", "bounds":[0,1], "title": "DI-P", "default":0.01},
                            "IV":{"type": "float", "bounds":[0,1], "title": "DI-P", "default":0.01},
                        }
                    },
                    "pore_region_height": {
                        "type": "composed_dict",
                        "pad":"0px","cpad":"8px",
                        "title":"Pore-Loop Area Height:",
                        "depth": 1,
                        "subs": {
                            "I":{"type": "float", "bounds":[0,1], "title": "DI-P", "default":0.4},
                            "II":{"type": "float", "bounds":[0,1], "title": "DI-P", "default":0.4},
                            "III":{"type": "float", "bounds":[0,1], "title": "DI-P", "default":0.4},
                            "IV":{"type": "float", "bounds":[0,1], "title": "DI-P", "default":0.4},
                        }
                    },
                    "long_loops_draw_opts": {
                        "type": "dict", "title": "Long Loops Rendering",
                        "pad":"0px","cpad":"8px",
                        "subs": {
                            "type":"skip",
                            "fill":"skip",
                            "stroke": {"type":"color", "title": "L-Loop Stroke Fill:", "default":"black"},
                            "opacity": {"type": "float", "bounds":[0,1], "title": "L-Loop Opacity", "default":1},
                            "stroke_size": {"type":"int","bounds":[], "title":"L-Loop Stroke Size", "default":3},
                            "width": {
                                "type":"dict", "title":"Interdomain Width.",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type": {
                                        "type": "select",
                                        "title": "Calc Mode:",
                                        "options": ["fixed", "custom", "scaled"],
                                        "updatable": {
                                            "type": false,
                                        }
                                    }
                                }
                            },
                            "calc_len": {
                                "type":"dict", "title":"Length Calc.",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":{
                                        "type": "select",
                                        "title": "Calc Mode:",
                                        "options": ["fixed", "custom", "scaled", "reslen"],
                                        "updatable": {
                                            "type": true,
                                            "select_id": "protein>long_loops_draw_opts>calc_len>calc"
                                        }
                                    },
                                    "calc":{
                                        "type": "relative_dict",
                                        "pad":"0px","cpad":"8px",
                                        "title": "Calc Options:",
                                        "select_id": "protein>long_loops_draw_opts>calc_len>type",
                                        "subs": {
                                            "fixed":{
                                                "height":{"type":"float", "bounds":[0,1], "title":"L-Loop Height", "default": 0.1},
                                                "width":{"type":"float", "bounds":[0,1], "title":"L-Loop Width", "default": 0.0025},
                                            },
                                            "scaled": {
                                                "height":{"type":"float", "bounds":[0,1], "title":"L-Loop max Height", "default": 0.1},
                                                "width":{"type":"float", "bounds":[0,1], "title":"L-Loop max Width", "default": 0.0025},
                                                "scale": {
                                                    "type": "select",
                                                    "title": "S-Loop Scale Type",
                                                    "options": ["linear", "power", "log"],
                                                    "updatable": {
                                                        "type": false,
                                                    }
                                                },
                                                "exponent":{"type":"int","bounds":[], "title":"Power Scale exponent", "default":2},
                                                "base":{"type":"int","bounds":[], "title":"Log Scale base", "default":10},
                                            },
                                            "reslen": {
                                                "length":{"type":"int","bounds":[], "title":"L-Loop Length", "default":2},
                                            },
                                            "custom": {
                                                "width": {
                                                    "type": "composed_dict",
                                                    "pad":"0px","cpad":"8px",
                                                    "title":"Long-Loop Widths:",
                                                    "depth": 1,
                                                    "subs": {
                                                        2:{"type": "float", "bounds":[0,1], "title":"DI-LL1","default":0.01},
                                                        3:{"type": "float", "bounds":[0,1], "title":"DI-LL2","default":0.01},
                                                        4:{"type": "float", "bounds":[0,1], "title":"DI-LL3","default":0.01},
                                                    }
                                                },
                                                "height": {
                                                    "type": "composed_dict",
                                                    "pad":"0px","cpad":"8px",
                                                    "title":"Long-Loop Heights:",
                                                    "depth": 1,
                                                    "subs": {
                                                        2:{"type": "float", "bounds":[0,1], "title":"DI-LL1","default":0.1},
                                                        3:{"type": "float", "bounds":[0,1], "title":"DI-LL2","default":0.1},
                                                        4:{"type": "float", "bounds":[0,1], "title":"DI-LL3","default":0.1},
                                                    }
                                                }
                                            }
                                        }
                                    },
                                }
                            },
                            "shape": {
                                "type":"dict", "title":"Loop Shape:",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":{
                                        "type": "select",
                                        "title": "Shape Type:",
                                        "options": ["simple", "bulb", "mushroom"],
                                        "updatable": {
                                            "type": true,
                                            "select_id": "protein>long_loops_draw_opts>shape>calc"
                                        }
                                    },
                                    "calc":{
                                        "type": "relative_dict",
                                        "pad":"0px","cpad":"8px",
                                        "title": "Shape Calc:",
                                        "select_id": "protein>long_loops_draw_opts>shape>type",
                                        "subs": {
                                            "simple":{
                                                "y_step":{"type": "float", "bounds":[], "title": "Y step:", "default":0.5},
                                            },
                                            "bulb": {
                                                "y_step":{"type": "float", "bounds":[], "title": "Y step:", "default":0.5},
                                                "perc_step_y":{"type": "float", "bounds":[0,1], "title": "Perc Y step:", "default":0.5},
                                                "x_step":{"type": "float", "bounds":[], "title": "X step:", "default":0.5},
                                            },
                                            "mushroom": {
                                                "y_step":{"type": "float", "bounds":[], "title": "Y step:", "default":0.5},
                                                "perc_step_y1":{"type": "float", "bounds":[0,1], "title": "Perc Y1 step:", "default":0.1},
                                                "perc_step_y2":{"type": "float", "bounds":[0,1], "title": "Perc Y2 step:", "default":0.5},
                                                "x_step":{"type": "float", "bounds":[], "title": "X step:", "default":0.5},
                                                "perc_center_x":{"type": "float", "bounds":[0,1], "title": "Perc X center:", "default":0.7},
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "nter_loop_width": {"type": "float", "bounds":[0,1], "title": "N-ter Loop Area Width", "default":0.05},
                    "nter_loop_draw_opts": {
                        "type": "dict", "title": "N-ter Loop Rendering",
                        "pad":"0px","cpad":"8px",
                        "subs": {
                            "type":"skip",
                            "fill":"skip",
                            "stroke": {"type":"color", "title": "N-ter Loop Stroke Fill:", "default":"black"},
                            "opacity": {"type": "float", "bounds":[0,1], "title": "N-ter Loop Opacity", "default":1},
                            "stroke_size": {"type":"int","bounds":[], "title":"N-ter Loop Stroke Size", "default":3},
                            "calc_len": {
                                "type":"dict", "title":"Length Calc.",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":{
                                        "type": "select",
                                        "title": "Calc Mode:",
                                        "options": ["fixed", "reslen"],
                                        "updatable": {
                                            "type": true,
                                            "select_id": "protein>nter_loop_draw_opts>calc_len>calc"
                                        }
                                    },
                                    "calc":{
                                        "type": "relative_dict",
                                        "pad":"0px","cpad":"8px",
                                        "title": "Calc Opts:",
                                        "select_id": "protein>nter_loop_draw_opts>calc_len>type",
                                        "subs": {
                                            "fixed":{
                                                "height":{"type":"float", "bounds":[0,1], "title":"N-ter Loop Height", "default": 0.1},
                                                "width":{"type":"float", "bounds":[0,1], "title":"N-ter Loop Width", "default": 0.0025},
                                            },
                                            "reslen": {
                                                "length":{"type":"int","bounds":[], "title":"N-ter Loop Length", "default":2},
                                            }
                                        }
                                    },
                                }
                            },
                            "shape": {
                                "type":"dict", "title":"Loop Shape:",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":"skip",
                                    "calc":{
                                        "type": "dict", "title":"Loop Shape Calc:",
                                        "pad":"0px","cpad":"8px",
                                        "subs": {
                                            "y_step":{"type": "float", "bounds":[], "title": "Y step:", "default":0.5},
                                            "perc_centers_height":{"type":"array","subtype":"float", "bounds":[],"title":"Wave heights", "default":[1.0, 0.5]},// height percentage of each wave
                                            "loop_rotation": {"type": "float", "bounds":[0, 360], "title": "Loop angle:", "default":30}, //rotation of loop around starting point
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "cter_loop_width": {"type": "float", "bounds":[0,1], "title": "C-ter Loop Area Width", "default":0.05},
                    "cter_loop_draw_opts": {
                        "type": "dict", "title": "C-ter Loop Rendering",
                        "pad":"0px","cpad":"8px",
                        "subs": {
                            "type":"skip",
                            "fill":"skip",
                            "stroke": {"type":"color", "title": "C-ter Loop Stroke Fill:", "default":"black"},
                            "opacity": {"type": "float", "bounds":[0,1], "title": "C-ter Loop Opacity", "default":1},
                            "stroke_size": {"type":"int","bounds":[], "title":"C-ter Loop Stroke Size", "default":3},
                            "calc_len": {
                                "type":"dict", "title":"Length Calc.",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":{
                                        "type": "select",
                                        "title": "Calc Mode:",
                                        "options": ["fixed", "reslen"],
                                        "updatable": {
                                            "type": true,
                                            "select_id": "protein>cter_loop_draw_opts>calc_len>calc"
                                        }
                                    },
                                    "calc":{
                                        "type": "relative_dict",
                                        "pad":"0px","cpad":"8px",
                                        "title": "Calc Opts:",
                                        "select_id": "protein>cter_loop_draw_opts>calc_len>type",
                                        "subs": {
                                            "fixed":{
                                                "height":{"type":"float", "bounds":[0,1], "title":"C-ter Loop Height", "default": 0.1},
                                                "width":{"type":"float", "bounds":[0,1], "title":"C-ter Loop Width", "default": 0.0025},
                                            },
                                            "reslen": {
                                                "length":{"type":"int","bounds":[], "title":"C-ter Loop Length", "default":2},
                                            }
                                        }
                                    },
                                }
                            },
                            "shape": {
                                "type":"dict", "title":"Loop Shape:",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":"skip",
                                    "calc":{
                                        "type": "dict", "title":"Loop Shape Calc:",
                                        "pad":"0px","cpad":"8px",
                                        "subs": {
                                            "y_step":{"type": "float", "bounds":[], "title": "Y step:", "default":0.5},
                                            "perc_centers_height":{"type":"array","subtype":"float", "bounds":[],"title":"Wave heights", "default":[1.0, 0.8, 0.5, 0.4]},// height percentage of each wave
                                            "loop_rotation": {"type": "float", "bounds":[0, 360], "title": "Loop angle:", "default":-30}, //rotation of loop around starting point
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "residue_centroid_draw_opts":{
                        "type": "skip",
                    },
                    "residue_relations_draw_opts": {
                        "type": "dict", "title": "Relations Rendering",
                        "pad":"0px","cpad":"8px",
                        "subs": {
                            "type": "skip",
                            "opacity": {"type": "float", "bounds":[0,1], "title": "Edge Opacity", "default":1},
                            "stroke_size":{"type":"int","bounds":[], "title":"Edge Stroke Size","default":1.5},
                            "stroke": {"type":"color", "title": "Edge Stroke Fill:", "default":"green"},
                            "fill": {"type":"color", "title": "Edge Fill:", "default":"lightgreen"},
                            "centroid_pos":{
                                "type":"dict", "title": "Edge Centroid Pos Opts:",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":{
                                        "type": "select",
                                        "title": "Edge Weight Scaling:",
                                        "options":["fixed","custom"],
                                        "updatable": {
                                            "type": false,
                                        }
                                    },
                                    "perc_x":{"type":"floatWString","title":"Fixed Edge Cent X Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                    "perc_y":{"type":"floatWString","title":"Fixed Edge Cent Y Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                    "perc_dict":{
                                        "type":"dict", "title": "Custom Edges Centroid:",
                                        "pad":"0px","cpad":"8px",
                                        "subs": {
                                            "intramembrane": {
                                                "type":"dict", "title": "From Intramembranar element:",
                                                "pad":"0px","cpad":"8px",
                                                "subs": {
                                                    "intramembrane":{
                                                        "type":"dict", "title": "To Intramembranar element",
                                                        "pad":"0px","cpad":"8px",
                                                        "subs": {
                                                            "perc_y1":{"type":"floatWString","title":"Edge Cent Y Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                            "perc_x1":{"type":"floatWString","title":"Edge Cent X Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                        }
                                                    },
                                                    "intracellular":{
                                                        "type":"dict", "title": "To Intracellular element",
                                                        "pad":"0px","cpad":"8px",
                                                        "subs": {
                                                            "perc_y1":{"type":"floatWString","title":"Edge Cent Y Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                            "perc_x1":{"type":"floatWString","title":"Edge Cent X Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                        }
                                                    },
                                                    "extracellular":{
                                                        "type":"dict", "title": "To Extracellular element",
                                                        "pad":"0px","cpad":"8px",
                                                        "subs": {
                                                            "perc_y1":{"type":"floatWString","title":"Edge Cent Y Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                            "perc_x1":{"type":"floatWString","title":"Edge Cent X Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                        }
                                                    }
                                                }
                                            },
                                            "intracellular": {
                                                "type":"dict", "title": "From Intracellular element:",
                                                "pad":"0px","cpad":"8px",
                                                "subs": {
                                                    "intramembrane":{
                                                        "type":"dict", "title": "To Intramembranar element",
                                                        "pad":"0px","cpad":"8px",
                                                        "subs": {
                                                            "perc_y1":{"type":"floatWString","title":"Edge Cent Y Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                            "perc_x1":{"type":"floatWString","title":"Edge Cent X Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                        }
                                                    },
                                                    "intracellular":{
                                                        "type":"dict", "title": "To Intracellular element",
                                                        "pad":"0px","cpad":"8px",
                                                        "subs": {
                                                            "perc_y1":{"type":"floatWString","title":"Edge Cent Y Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                            "perc_x1":{"type":"floatWString","title":"Edge Cent X Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                        }
                                                    },
                                                    "extracellular":{
                                                        "type":"dict", "title": "To Extracellular element",
                                                        "pad":"0px","cpad":"8px",
                                                        "subs": {
                                                            "perc_y1":{"type":"floatWString","title":"Edge Cent Y Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                            "perc_x1":{"type":"floatWString","title":"Edge Cent X Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                        }
                                                    }
                                                }
                                            },
                                            "extracellular": {
                                                "type":"dict", "title": "From Extracellular element:",
                                                "pad":"0px","cpad":"8px",
                                                "subs": {
                                                    "intramembrane":{
                                                        "type":"dict", "title": "To Intramembranar element",
                                                        "pad":"0px","cpad":"8px",
                                                        "subs": {
                                                            "perc_y1":{"type":"floatWString","title":"Edge Cent Y Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                            "perc_x1":{"type":"floatWString","title":"Edge Cent X Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                        }
                                                    },
                                                    "intracellular":{
                                                        "type":"dict", "title": "To Intracellular element",
                                                        "pad":"0px","cpad":"8px",
                                                        "subs": {
                                                            "perc_y1":{"type":"floatWString","title":"Edge Cent Y Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                            "perc_x1":{"type":"floatWString","title":"Edge Cent X Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                        }
                                                    },
                                                    "extracellular":{
                                                        "type":"dict", "title": "To Extracellular element",
                                                        "pad":"0px","cpad":"8px",
                                                        "subs": {
                                                            "perc_y1":{"type":"floatWString","title":"Edge Cent Y Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                            "perc_x1":{"type":"floatWString","title":"Edge Cent X Pos","bounds":[0,1],"default":"between", "allow":["between"]},
                                                        }
                                                    }
                                                }
                                            },
                                        }
                                    },
                                }
                            },
                            "weight_scaling":{
                                "type": "select",
                                "title": "Edge Weight Scale Type:",
                                "options": ["absolute", "relative"],
                                "updatable": {
                                    "type": false,
                                }
                            },
                            "path_width_scaling":{
                                "type":"dict", "title": "Edge Width Scales:",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":{
                                        "type": "select",
                                        "title": "Edge Weight Scale:",
                                        "options": ["none", "fixed", "calc"],
                                        "updatable": {
                                            "type": false,
                                        }
                                    },
                                    "perc_x":{"type":"float","title":"Edge Width for fixed","bounds":[0,1],"default":0.01},
                                    "domain":{
                                        "type":"arrayConnected",
                                        "title":"Width Scale Domain",
                                        "select_id":"protein>residue_relations_draw_opts>path_width_scaling>range",
                                        "default":["min", "max"],
                                        "subtype":"floatWString",
                                        "bounds":[0,1],
                                        "allow":["min", "max"]
                                    },
                                    "range":{
                                        "type":"arrayConnected",
                                        "title":"Width Scale Range",
                                        "select_id":"protein>residue_relations_draw_opts>path_width_scaling>domain",
                                        "default":[2, 5],
                                        "subtype":"float",
                                        "bounds":[],
                                    },
                                    "group_by_type":{"type":"boolean","title":"Group Weights by Edge type?","default":true},
                                }
                            },
                            "color_scaling": {
                                "type":"dict", "title": "Edge Color Scales:",
                                "pad":"0px","cpad":"8px",
                                "subs":{
                                    "type":{
                                        "type": "select",
                                        "title": "Edge Color Scale:",
                                        "options": ["weight", "type", "none"],
                                        "updatable": {
                                            "type": false,
                                        },
                                        "custom_update": {
                                            "select_id":"protein>residue_relations_draw_opts>color_scaling>domain"
                                        }
                                    },
                                    "property":{"default":"weight"},
                                    "domain":{
                                        "type":"arrayConnectedAccording",
                                        "title":"Color Scale Domain",
                                        "select_id":"protein>residue_relations_draw_opts>color_scaling>range",
                                        "according_id":"protein>residue_relations_draw_opts>color_scaling>type",
                                        "default":["min", "max"],
                                        "subtype":{
                                            "weight":"floatWString",
                                            "type":"text",
                                            "none": ""
                                        },
                                        "defaults": {
                                            "weight":["min", "max"],
                                            "type":["Change this", "Change this"]
                                        },
                                        "bounds":[0,1],
                                        "allow":["min", "max"]
                                    },
                                    "range":{
                                        "type":"arrayConnected",
                                        "title":"Color Scale Range",
                                        "select_id":"protein>residue_relations_draw_opts>color_scaling>domain",
                                        "default":[2, 5],
                                        "subtype":"color",
                                        "default":["red", "green"]
                                    },
                                    "lighter_fill":{"type":"boolean","title":"Auto lighten Edge Fill?","default":true},
                                }
                            },
                            "element_centroid_scaling": {
                                "type":"dict", "title": "Centroid Scaling",
                                "pad":"0px","cpad":"8px",
                                "subs": {
                                    "type":{
                                        "type": "select",
                                        "title": "Edge Centroid Scale:",
                                        "options": ["fixed", "none"],
                                        "updatable": {
                                            "type": false,
                                        }},
                                    "radius":{"default":5}
                                }
                            }
                        }
                    },
                },
            },
            "text_defs": {
                "type":"dict", "title": "Text defaults",
                "pad":"0px","cpad":"8px",
                "subs": {
                    "font_family": {"type":"text","title":"Default Font family", "default": "sans-serif"},
                    "font_style": {
                        "type":"select",
                        "title":"Default Font style",
                        "options": ["normal", "italic"],
                        "updatable": {
                            "type": false,
                        },
                    },
                    "font_size": {"type":"int", "bounds":[],"title":"Default Font size","default": 30},
                    "fill": {"type":"color","title":"Default Font color","default": "black"},
                    "center_xy": {"type":"boolean","title":"Center text on coordinates?","default": true},
                },
            },

        }
        this.main_style_keys = Object.keys(this.naview_obj.getStyleObject());
        this.style_obj_copy = this.deepCopy(this.naview_obj.getStyleObject());
        this.createEditor();
    }

    retrieveSubKeysStyleObj(key) {
        let current_style_obj = this.naview_obj.getStyleObject();
        if (key.includes(">")) {
            let all_keys = key.split(">");
            for (let iak = 0; iak < all_keys.length; iak++) {
                let sub_key = all_keys[iak];
                current_style_obj = current_style_obj[sub_key];
            }
        } else {
            current_style_obj = current_style_obj[key];
        }
        return Object.keys(current_style_obj);
    }

    retrieveSubObjStyleObj(key) {
        let current_style_obj = this.naview_obj.getStyleObject();
        if (key.includes(">")) {
            let all_keys = key.split(">");
            for (let iak = 0; iak < all_keys.length; iak++) {
                let sub_key = all_keys[iak];
                if (current_style_obj.hasOwnProperty(sub_key)) {
                    current_style_obj = current_style_obj[sub_key];
                }
            }
        } else {
            current_style_obj = current_style_obj[key];
        }
        return current_style_obj;
    }

    setCopyObjStyle(key, value, to_print) {
        let current_style_obj = this.style_obj_copy;
        if (key.includes(">")) {
            let all_keys = key.split(">");
            let end_key = all_keys[all_keys.length-1];
            all_keys = all_keys.slice(0, all_keys.length-1);
            for (let iak = 0; iak < all_keys.length; iak++) {
                let sub_key = all_keys[iak];
                if (current_style_obj.hasOwnProperty(sub_key)) {
                    current_style_obj = current_style_obj[sub_key];
                }
            }
            if (to_print) {
                console.log("found k");
                console.log("end_key");
                console.log(end_key);
                console.log("value");
                console.log(value);
            }
            current_style_obj[end_key] = value;
        } else {
            if (to_print) {
                console.log("found k");
                console.log("key");
                console.log(key);
                console.log("value");
                console.log(value);
            }
            current_style_obj[key] = value;
        }
    }

    createEditor() {
        let that = this;
        let div_selection = d3.select("#"+this.editor_id);
        if (div_selection.size() === 0) {
            // d3.select("#" + this.naview_obj.getSvgId());
            let svg_box = document.getElementById(this.naview_obj.getSvgId()).getBoundingClientRect();
            console.log("svg_box");
            console.log(svg_box);

            div_selection = d3.select("body").append("div").attr("id", this.editor_id);
            // div_selection.style("position", "fixed");
            div_selection.style("position", "absolute");
            // div_selection.style("top", "20%");
            div_selection.style("top", (svg_box.top+(svg_box.height/4))+"px");
            div_selection.style("left", "80%");
            div_selection.style("z-index", "5");
            div_selection.style("max-width", "250px");
            div_selection.style("min-width", "250px");
            div_selection.style("background-color", "#000000bf");
            div_selection.style("font-family", "monospace");
            div_selection.style("font-size", "15px");
            div_selection.style("color", "white");
            div_selection.style("max-height", "70%");
            div_selection.style("overflow-y", "scroll");
            div_selection.style("overflow-y", "scroll");
            
            this.createDropDown(div_selection, "Naview Style Editor ", this.editor_id, true, "center", "5px", "5px");
            this.createMainDiv();
            let that = this;
            let btn_div = d3.select("#"+this.editor_id+"main_editor")
            .append("div")
            .style("text-align", "center");

            btn_div.append("button")
            // .style("box-shadow","inset 0px 1px 0px 0px #ffffff")
            // .style("background","linear-gradient(to bottom, #ededed 5%, #dfdfdf 100%)")
            // .style("background-color","#ededed")
            // .style("border","1px solid #dcdcdc")
            // .style("color","#777777")
            // .style("font-family","Arial")
            // .style("font-weight","bold")
            // .style("text-shadow","0px 1px 0px #ffffff")
            // .style("display","inline-block")
            .style("width", "150px")
            .style("background-color", "#4c4b4b")
            .style("border-radius","6px")
            .style("cursor","pointer")
            .style("color","white")
            .style("font-size","15px")
            .style("padding","6px ")
            .style("text-decoration","none")
            .html("&#8635; Update Plot")
            .on("click", function() {
                that.sendToNaViewObj();
            });
            btn_div.append("br");
            btn_div.append("button")
            .style("width", "150px")
            .style("background-color", "#4c4b4b")
            .style("border-radius","6px")
            .style("cursor","pointer")
            .style("color","white")
            .style("font-size","15px")
            .style("padding","6px ")
            .style("text-decoration","none")
            .html("&#10093; Open Console")
            .on("click", function() {
                that.openConsole();
            });
            btn_div.append("br");
            btn_div.append("input")
            .attr("id", "input_csv")
            .attr("type", "file")
            .attr("accept", ".csv")
            .style("visibility", "hidden")
            .style("width", "0")
            .style("height", "0")
            .on("input", function() {
                let fileList = d3.select(this).property("files");
                const reader = new FileReader();
                reader.addEventListener('load', (event) => {
                    const result = event.target.result;
                    // Do something with result
                    that.uploadProperties(result);
                });
                for (const file of fileList) {
                    reader.readAsText(file);
                }
            });

            btn_div.append("button")
            .style("width", "150px")
            .style("background-color", "#4c4b4b")
            .style("border-radius","6px")
            .style("cursor","pointer")
            .style("color","white")
            .style("font-size","15px")
            .style("padding","6px ")
            .style("text-decoration","none")
            .html("&#11014; Add Prop. CSV")
            .on("click", function() {
                // const fileList = event.target.files;
                // console.log(fileList);
                var click_evt = new MouseEvent('click', {
                    view: window,
                    bubbles: false,
                    cancelable: true
                });
                document.getElementById("input_csv").dispatchEvent(click_evt);
                // d3.select("#input_csv").dispatch("click");
            });

            btn_div.append("br");
            btn_div.append("input")
            .attr("id", "input_csv2")
            .attr("type", "file")
            .attr("accept", ".csv")
            .style("visibility", "hidden")
            .style("width", "0")
            .style("height", "0")
            .on("input", function() {
                let fileList = d3.select(this).property("files");
                const reader = new FileReader();
                reader.addEventListener('load', (event) => {
                    const result = event.target.result;
                    // Do something with result
                    that.uploadRelations(result);
                });
                for (const file of fileList) {
                    reader.readAsText(file);
                }
            });
            btn_div.append("button")
            .style("width", "150px")
            .style("background-color", "#4c4b4b")
            .style("border-radius","6px")
            .style("cursor","pointer")
            .style("color","white")
            .style("font-size","15px")
            .style("padding","6px ")
            .style("text-decoration","none")
            .html("&#11014; Add Rel. CSV")
            .on("click", function() {
                var click_evt = new MouseEvent('click', {
                    view: window,
                    bubbles: false,
                    cancelable: true
                });
                document.getElementById("input_csv2").dispatchEvent(click_evt);
            });
            btn_div.append("br");
            btn_div.append("button")
            .style("width", "150px")
            .style("background-color", "#4c4b4b")
            .style("border-radius","6px")
            .style("cursor","pointer")
            .style("color","white")
            .style("font-size","15px")
            .style("padding","6px ")
            .style("text-decoration","none")
            .html("&#11015; Style Object")
            .on("click", function() {
                that.downloadStyleObject();
            });
            btn_div.append("br");
            btn_div.append("button")
            .style("width", "150px")
            .style("background-color", "#4c4b4b")
            .style("border-radius","6px")
            .style("cursor","pointer")
            .style("color","white")
            .style("font-size","15px")
            .style("padding","6px ")
            .style("text-decoration","none")
            .html("&#11015; Img as SVG ")
            .on("click", function() {
                that.downloadImage("svg");
            });
            btn_div.append("br");
            btn_div.append("button")
            .style("width", "150px")
            .style("background-color", "#4c4b4b")
            .style("border-radius","6px")
            .style("cursor","pointer")
            .style("color","white")
            .style("font-size","15px")
            .style("padding","6px ")
            .style("text-decoration","none")
            .html("&#11015; Img as PNG")
            .on("click", function() {
                that.downloadImage("png");
            });
            d3.selectAll(".select_to_trigger").dispatch("change");
        }
    }

    createMainDiv() {
        for (let imk = 0; imk < this.main_style_keys.length; imk++) {
            let main_key = this.main_style_keys[imk];
            this.elementCreator(main_key, this.editor_id+"main_editor");
        }
    }

    createDropDown(d3_element_parent, dropdown_title, new_id, allowclose,text_centering,padding_left,child_padding_left) {
        if (dropdown_title.endsWith(":") === false && dropdown_title !== "Style Object Editor ") {
            dropdown_title = dropdown_title + ":"
        }
        let div_dropdown = d3_element_parent.append("div")
        .style("text-align", text_centering)
        .style("padding-left", padding_left);

        div_dropdown.append("div")
        .style("text-align", text_centering)
        .style("display", "inline")
        .append("span")
        .style("user-select", "none")
        .html(dropdown_title);

        div_dropdown.append("span")
        .attr("id", new_id+"id_status")
        .style("cursor", "pointer")
        .style("user-select", "none")
        .html("&#9660;")
        .style("right", "0")
        .datum({"opened": false})
        .on("click", function(d) {
            let currentOpened = d.opened && true;
            if (currentOpened === false) {
                d3.select("#"+ new_id+"id_status").html("&#9650;");
                d3.select("#"+ new_id+"main_editor").style("display", "");
            } else {
                d3.select("#"+ new_id+"id_status").html("&#9660;");
                d3.select("#"+ new_id+"main_editor").style("display", "none");
            }
            d3.select(this).datum({"opened": !currentOpened});
        });
        
        if (allowclose === true) {
            div_dropdown.append("span")
            .attr("id", new_id+"close_editor")
            .style("cursor", "pointer")
            .style("user-select", "none")
            .html("&#10006;")
            .on("click", function() {
                d3.select("#"+ new_id).remove();
            })
        }

        let text_centering_editor = "left"
        d3_element_parent.append("div")
        .attr("id", new_id+"main_editor")
        .style("display", "none")
        .style("text-align", text_centering_editor)
        .style("padding-left", child_padding_left);
        d3_element_parent.append("br");
    }

    createSelect(d3_element_parent, select_title, new_id, select_options, select_default, updatable_obj, select_obj, style_key) {
        let change_datum = this.deepCopy(updatable_obj);
        change_datum.update_id = style_key;
        change_datum.value = select_default;
        if (select_obj.hasOwnProperty("custom_update")) {
            change_datum.custom_update = select_obj.custom_update;
        }

        if (select_title.endsWith(":") === false) {
            select_title = select_title + ":"
        }
        let select_div = d3_element_parent.append("div")
        // .style("text-align", "center");
        // .style("display", "inline");
        // .style("padding-left", "inherit");

        select_div.append("span")
        .style("user-select", "none")
        .html(select_title);

        select_div.append("br")

        let sub_select_div = select_div.append("div")
        .style("text-align", "center");

        let that = this;
        that.setCopyObjStyle(style_key, select_default);
        let main_select = sub_select_div.append("select")
        .attr("id", new_id+"_element")
        .attr("class","select_to_trigger")
        .style("border-radius", "6px")
        .style("background-color", "#404040")
        .style("color", "white")
        .style("margin", "5px")
        .style("padding", "2px")
        .style("font-size", "15px")
        .datum(change_datum)
        .on('change', function(d) {
            var new_value = d3.select(this).property('value');
            let old_datum = that.deepCopy(d3.select("#"+new_id+"_element").datum());
            old_datum.value = new_value;
            d3.select("#"+new_id+"_element").datum(old_datum);
            if (d.hasOwnProperty("custom_update")) {//arrayConnectedAccording
                let trigger_update_id = d["custom_update"]["select_id"].replaceAll(">", "_")+"_hidden_update_btn";
                d3.select('#'+trigger_update_id).dispatch('click');
            }
            that.setCopyObjStyle(style_key, new_value);

            if (d.type === true) {
                let id_to_select = d.select_id.replaceAll(">", "_")+"main_editor";
                // let div_toupdate_dom = document.getElementById(id_to_select);
                let div_toupdate = d3.select("#"+id_to_select);
                div_toupdate.html("");
                let obj_in_html = that.retrieveStyleHTMLFromKeys(d.select_id);
                let new_objs = obj_in_html.subs[new_value];
                for (const nobjk in new_objs) {
                    if (new_objs.hasOwnProperty(nobjk)) {
                        let new_obj = new_objs[nobjk];
                        let new_obj_id = d.select_id + ">" + new_value + ">" + nobjk;
                        let new_obj_id_original = d.select_id + ">" + nobjk;
                        that.elementCreator(new_obj_id,id_to_select, new_obj_id_original);
                    }
                }
            }
        });

        for (let ieop = 0; ieop < select_options.length; ieop++) {
            let option_string = select_options[ieop];
            let opt_el = main_select.append("option")
            .attr("value", option_string)
            .html(option_string);
            if (option_string === select_default) {
                opt_el.attr("selected", "selected");
            }
        }
        main_select.dispatch("change");
    }

    createFloatSpinner(d3_element_parent, select_title, new_id, default_value, bounds,spinner_br, style_key) {
        let change_datum = {};
        change_datum.update_id = style_key;
        default_value = parseFloat(default_value);

        if (select_title.endsWith(":") === false) {
            select_title = select_title + ":"
        }
        let spinner_div = d3_element_parent.append("div")
        // .style("text-align", "center")
        // .style("display", "inline");
        // .style("padding-left", "inherit");

        spinner_div.append("span")
        .style("user-select", "none")
        .html(select_title);


        spinner_div.append("br")

        let sub_spinner_div = spinner_div.append("div")
        .style("text-align", "center");

        let that = this;
        that.setCopyObjStyle(style_key, default_value);
        let spinner_input = sub_spinner_div.append("input")
        .datum(change_datum)
        .attr("id", new_id+"_element")
        .attr("type", "number")
        .style("border-radius", "6px")
        .style("background-color", "#404040")
        .style("color", "white")
        .attr("step", 0.1)
        .style("width", "4.5em")
        .attr("value", default_value)
        .on('change', function(d) {
            console.log("changed spinner");
            let new_value = parseFloat(d3.select(this).property("value"));
            that.setCopyObjStyle(style_key, new_value);
        });
        if (bounds) {
            spinner_input
            .attr("min",bounds[0])
            .attr("max",bounds[1]);
        }
        if (spinner_br) {
            spinner_div.append("br");
        }
    }

    createIntSpinner(d3_element_parent, select_title, new_id, default_value, bounds, spinner_br, style_key) {
        let change_datum = {};
        change_datum.update_id = style_key;
        default_value = parseInt(default_value);

        if (select_title.endsWith(":") === false) {
            select_title = select_title + ":"
        }
        let spinner_div = d3_element_parent.append("div")
        // .style("text-align", "center")
        // .style("display", "inline");
        // .style("padding-left", "inherit");

        spinner_div.append("span")
        .style("user-select", "none")
        .html(select_title);


        spinner_div.append("br")

        let sub_spinner_div = spinner_div.append("div")
        .style("text-align", "center");

        let that = this;
        that.setCopyObjStyle(style_key, default_value);

        let spinner_input = sub_spinner_div.append("input")
        .datum(change_datum)
        .attr("id", new_id+"_element")
        .attr("type", "number")
        .style("border-radius", "6px")
        .style("background-color", "#404040")
        .style("color", "white")
        .attr("step", 1)
        .style("width", "4.5em")
        .attr("value", default_value)
        .on('change', function(d) {
            console.log("changed spinner");
            let new_value = parseInt(d3.select(this).property("value"));
            that.setCopyObjStyle(style_key, new_value);
        });
        if (bounds) {
            spinner_input
            .attr("min",bounds[0])
            .attr("max",bounds[1]);
        }
        if (spinner_br) {
            spinner_div.append("br");
        }
    }

    createColorInput(d3_element_parent, select_title, new_id, default_color, color_br, style_key) {
        let change_datum = {};
        change_datum.update_id = style_key;
        default_color = this.colorToRGB(default_color);
        default_color = this.rgbToHex(default_color[0],default_color[1],default_color[2]);

        let color_div = d3_element_parent.append("div")
        // .style("text-align", "center")
        // .style("display", "inline");
        // .style("padding-left", "inherit");

        if (select_title.endsWith(":") === false) {
            select_title = select_title + ":"
        }

        color_div.append("span")
        .style("user-select", "none")
        .html(select_title);

        color_div.append("br")

        let sub_color_div = color_div.append("div")
        .style("text-align", "center");

        let that = this;
        that.setCopyObjStyle(style_key, default_color);

        let color_input = sub_color_div.append("input")
        .datum(change_datum)
        .attr("id", new_id+"_element")
        .attr("type", "color")
        .style("border-radius", "3px")
        .style("background-color", "#ffffff00")
        .style("padding", "0px")
        .style("width", "4em")
        .style("height", "2em")
        .style("border-color", "#ffffff00")
        .attr("value", default_color)
        .on('change', function(d) {
            console.log("changed color");
            let new_value = d3.select(this).property("value");
            that.setCopyObjStyle(style_key, new_value);
        });
        if (color_br) {
            color_div.append("br");
        }
    }

    createCheckBox(d3_element_parent, select_title, new_id, default_state, bollean_br, style_key) {
        let change_datum = {};
        change_datum.update_id = style_key;

        if (select_title.endsWith(":") === false && select_title.endsWith("?") === false) {
            select_title = select_title + ":"
        } 

        let bollean_div = d3_element_parent.append("div")

        bollean_div.append("span")
        .style("user-select", "none")
        .html(select_title);

        bollean_div.append("br")

        let sub_bollean_div = bollean_div.append("div")
        .style("text-align", "center");

        let that = this;
        that.setCopyObjStyle(style_key, default_state);

        let bollean_input = sub_bollean_div.append("input")
        .datum(change_datum)
        .attr("id", new_id+"_element")
        .attr("type", "checkbox")
        .attr("name", default_state)
        .on('change', function(d) {
            console.log("changed color");
            let new_value = d3.select(this).property("checked") && true;
            that.setCopyObjStyle(style_key, new_value);
        });
        if (default_state) {
            bollean_input.property('checked', true);
        } else {
            bollean_input.property('checked', false);
        }
        if (bollean_br) {
            bollean_div.append("br");
        }
    }

    createArrayEditor(d3_element_parent, select_title, new_id, default_state, current_obj, check_br, style_key) {
        let change_datum = {};
        let that = this;
        change_datum.update_id = style_key;
        change_datum.array = default_state;

        if (select_title.endsWith(":") === false) {
            select_title = select_title + ":"
        } 

        let array_div = d3_element_parent.append("div")
        .datum(change_datum);

        array_div.append("span")
        .style("user-select", "none")
        .html(select_title);

        array_div.append("br")

        if (current_obj.subtype === "float") {

            let sub_array_div = array_div.append("div")
            .style("text-align", "center");

            function createArrayDo(data_array) {
                that.setCopyObjStyle(style_key, data_array);

                sub_array_div.html("");
                sub_array_div.append("input")
                .attr("type", "button")
                .style("border-radius", "6px")
                .style("color", "white")
                .style("background-color", "#404040")
                .style("font-size", "20px")
                .attr("value", "+")
                .on("click", function() {
                    let previous_array = that.deepCopy(array_div.datum().array);
                    previous_array.push(0.5);
                    array_div.datum().array = previous_array;
                    createArrayDo(previous_array);
                });
                sub_array_div.append("input")
                .attr("type", "button")
                .style("border-radius", "6px")
                .style("color", "white")
                .style("background-color", "#404040")
                .style("font-size", "20px")
                .attr("value", "-")
                .on("click", function() {
                    let previous_array = that.deepCopy(array_div.datum().array);
                    if (previous_array.length > 1) {
                        previous_array.pop();
                        array_div.datum().array = previous_array;
                        createArrayDo(previous_array);
                    }
                });
                sub_array_div.append("br");

                sub_array_div.append("div")
                .attr("id", new_id+"_element")
                .style("display", "inline")
                .style("text-align", "left")
                .selectAll(".input_array"+new_id)
                .data(data_array)
                .enter()
                .append("input")
                .attr("class", "input_array"+new_id)
                .attr("type", "number")
                .style("border-radius", "6px")
                .style("background-color", "#404040")
                .style("color", "white")
                .attr("step", 0.1)
                .style("width", "4.5em")
                .attr("value", function(d){
                    return d;
                })
                .attr("min",current_obj.bounds[0])
                .attr("max",current_obj.bounds[1])
                .on('change', function(d, i) {
                    console.log("changed value");
                    let previous_array = that.deepCopy(array_div.datum().array);
                    previous_array[i] = parseFloat(d3.select(this).property('value'));
                    array_div.datum().array = previous_array;
                    d3.selectAll(".input_array"+new_id).data(previous_array);

                    that.setCopyObjStyle(style_key, previous_array);

                });
            }
            createArrayDo(default_state);

        }

    }

    createConnectArray(d3_element_parent, select_title, new_id, default_state, current_obj, add_br, style_key) {
        let change_datum = {};
        let that = this;
        change_datum.update_id = style_key;
        change_datum.array = default_state;

        if (select_title.endsWith(":") === false) {
            select_title = select_title + ":"
        } 

        let array_div = d3_element_parent.append("div")
        .datum(change_datum);

        array_div.append("span")
        .style("user-select", "none")
        .html(select_title);

        array_div.append("br");

        let main_div = array_div.append("div")
        .attr("id", new_id+"main_division");

        function resetFull(current_obj) {
            let current_data_array;
            let current_subtype;
            if (current_obj.hasOwnProperty("according_id") === false) { //arrayConnected
                current_subtype = current_obj.subtype;
                current_data_array = that.deepCopy(default_state);
            } else { //arrayConnectedAccording
                let according_id = current_obj.according_id;
                //get current value from according_id
                according_id = according_id.replaceAll(">", "_")+"_element";
                let according_value = d3.select("#"+according_id).datum().value;
                current_subtype = current_obj.subtype[according_value];
                current_data_array = current_obj.defaults[according_value];
            }
            reDraw(current_obj, current_subtype, current_data_array);
        }

        let current_data_array;
        let current_subtype;
        if (current_obj.hasOwnProperty("according_id") === false) { //arrayConnected
            current_subtype = current_obj.subtype;
            current_data_array = that.deepCopy(default_state);
        } else { //arrayConnectedAccording
            let according_id = current_obj.according_id;
            //get current value from according_id
            according_id = according_id.replaceAll(">", "_")+"_element";
            let according_value = d3.select("#"+according_id).datum().value;
            current_subtype = current_obj.subtype[according_value];
            current_data_array = current_obj.defaults[according_value];
        }
        //create hidden button for triggering redraw updates

       
        function reDraw(current_obj, subtype_str, data_array) {
            that.setCopyObjStyle(style_key, data_array);
            main_div.html("");
            array_div.datum().array = data_array;
            main_div.append("button")
            .attr("id", new_id+"_hidden_update_btn")
            .datum(current_obj)
            .style("visibility", "hidden")
            .on("click", function(d){
                resetFull(d);
            });
            let sub_main_div = main_div.append("div")
            .style("text-align", "center");
            if (subtype_str === "float") {
                sub_main_div.append("input")
                .attr("id", new_id+"_add_btn")
                .attr("type", "button")
                .style("border-radius", "6px")
                .style("color", "white")
                .style("background-color", "#404040")
                .style("font-size", "20px")
                .attr("value", "+")
                .attr("clicked", "false")
                .on("click", function() {
                    let previous_array = that.deepCopy(array_div.datum().array);
                    previous_array.push(0.5);
                    array_div.datum().array = previous_array;
                    reDraw(current_obj,subtype_str, previous_array);
                    //get sister button
                    if (d3.select(this).attr("clicked") === "false") {
                        let sister_btn_id = current_obj.select_id.replaceAll(">", "_")+"_add_btn";
                        d3.select("#"+sister_btn_id).attr("clicked", "true");
                        d3.select("#"+sister_btn_id).dispatch("click");
                    }
                    d3.select(this).attr("clicked", "false");
                });
                sub_main_div.append("input")
                .attr("id", new_id+"_sub_btn")
                .attr("type", "button")
                .style("border-radius", "6px")
                .style("color", "white")
                .style("background-color", "#404040")
                .style("font-size", "20px")
                .attr("value", "-")
                .attr("clicked", "false")
                .on("click", function() {
                    let previous_array = that.deepCopy(array_div.datum().array);
                    if (previous_array.length > 2) {
                        previous_array.pop();
                        array_div.datum().array = previous_array;
                        reDraw(current_obj,subtype_str, previous_array);
                        //get sister button
                        if (d3.select(this).attr("clicked") === "false") {
                            let sister_btn_id = current_obj.select_id.replaceAll(">", "_")+"_sub_btn";
                            d3.select("#"+sister_btn_id).attr("clicked", "true");
                            d3.select("#"+sister_btn_id).dispatch("click");
                        }
                        d3.select(this).attr("clicked", "false");
                    }
                });
                sub_main_div.append("br");

                sub_main_div.append("div")
                .attr("id", new_id+"_element")
                .style("display", "inline")
                .style("text-align", "left")
                .selectAll(".input_array"+new_id)
                .data(data_array)
                .enter()
                .append("input")
                .attr("class", "input_array"+new_id)
                .attr("type", "number")
                .style("border-radius", "6px")
                .style("background-color", "#404040")
                .style("color", "white")
                .attr("step", 0.1)
                .style("width", "4.5em")
                .attr("value", function(d){
                    return d;
                })
                .attr("min",current_obj.bounds[0])
                .attr("max",current_obj.bounds[1])
                .on('change', function(d, i) {
                    console.log("changed value");
                    let previous_array = that.deepCopy(array_div.datum().array);
                    previous_array[i] = parseFloat(d3.select(this).property('value'));
                    array_div.datum().array = previous_array;
                    d3.selectAll(".input_array"+new_id).data(previous_array);
                    that.setCopyObjStyle(style_key, previous_array);
                });
            } else if (subtype_str === "color") {
    
                sub_main_div.append("input")
                .attr("type", "button")
                .style("border-radius", "6px")
                .style("color", "white")
                .style("background-color", "#404040")
                .style("font-size", "20px")
                .attr("id", new_id+"_add_btn")
                .attr("value", "+")
                .attr("clicked", "false")
                .on("click", function() {
                    let previous_array = that.deepCopy(array_div.datum().array);
                    previous_array.push("#FFFFFF");
                    array_div.datum().array = previous_array;
                    reDraw(current_obj,subtype_str, previous_array);
                    if (d3.select(this).attr("clicked") === "false") {
                        let sister_btn_id = current_obj.select_id.replaceAll(">", "_")+"_add_btn";
                        d3.select("#"+sister_btn_id).attr("clicked", "true");
                        d3.select("#"+sister_btn_id).dispatch("click");
                    }
                    d3.select(this).attr("clicked", "false");
                });
                sub_main_div.append("input")
                .attr("type", "button")
                .style("border-radius", "6px")
                .style("color", "white")
                .style("background-color", "#404040")
                .style("font-size", "20px")
                .attr("id", new_id+"_sub_btn")
                .attr("value", "-")
                .attr("clicked", "false")
                .on("click", function() {
                    let previous_array = that.deepCopy(array_div.datum().array);
                    if (previous_array.length > 2) {
                        previous_array.pop();
                        array_div.datum().array = previous_array;
                        reDraw(current_obj,subtype_str, previous_array);
                        if (d3.select(this).attr("clicked") === "false") {
                            let sister_btn_id = current_obj.select_id.replaceAll(">", "_")+"_sub_btn";
                            d3.select("#"+sister_btn_id).attr("clicked", "true");
                            d3.select("#"+sister_btn_id).dispatch("click");
                        }
                        d3.select(this).attr("clicked", "false");
                    }
                });
                sub_main_div.append("br");

                sub_main_div.append("div")
                .attr("id", new_id+"_element")
                .style("display", "inline")
                .style("text-align", "left")
                .selectAll(".input_array"+new_id)
                .data(data_array)
                .enter()
                .append("input")
                .attr("class", "input_array"+new_id)
                .attr("type", "color")
                .style("border-radius", "3px")
                .style("background-color", "#ffffff00")
                .style("padding", "0px")
                .style("width", "4em")
                .style("height", "2em")
                .style("border-color", "#ffffff00")
                .attr("value", function(d){
                    let d_color = d;
                    d_color = that.colorToRGB(d_color);
                    d_color = that.rgbToHex(d_color[0],d_color[1],d_color[2]);
                    return d_color;
                })
                .on('change', function(d, i) {
                    console.log("changed c value");
                    let previous_array = that.deepCopy(array_div.datum().array);
                    previous_array[i] = parseFloat(d3.select(this).property('value'));
                    array_div.datum().array = previous_array;
                    d3.selectAll(".input_array"+new_id).data(previous_array);
                    that.setCopyObjStyle(style_key, previous_array);
                });
            } else if (subtype_str === "text") {
    
                sub_main_div.append("input")
                .attr("type", "button")
                .style("border-radius", "6px")
                .style("color", "white")
                .style("background-color", "#404040")
                .style("font-size", "20px")
                .attr("id", new_id+"_add_btn")
                .attr("value", "+")
                .attr("clicked", "false")
                .on("click", function() {
                    let previous_array = that.deepCopy(array_div.datum().array);
                    previous_array.push("Change this");
                    array_div.datum().array = previous_array;
                    reDraw(current_obj,subtype_str, previous_array);
                    if (d3.select(this).attr("clicked") === "false") {
                        let sister_btn_id = current_obj.select_id.replaceAll(">", "_")+"_add_btn";
                        d3.select("#"+sister_btn_id).attr("clicked", "true");
                        d3.select("#"+sister_btn_id).dispatch("click");
                    }
                    d3.select(this).attr("clicked", "false");
                });
                sub_main_div.append("input")
                .attr("type", "button")
                .style("border-radius", "6px")
                .style("color", "white")
                .style("background-color", "#404040")
                .style("font-size", "20px")
                .attr("id", new_id+"_sub_btn")
                .attr("value", "-")
                .attr("clicked", "false")
                .on("click", function() {
                    let previous_array = that.deepCopy(array_div.datum().array);
                    if (previous_array.length > 2) {
                        previous_array.pop();
                        array_div.datum().array = previous_array;
                        reDraw(current_obj,subtype_str, previous_array);
                        if (d3.select(this).attr("clicked") === "false") {
                            let sister_btn_id = current_obj.select_id.replaceAll(">", "_")+"_sub_btn";
                            d3.select("#"+sister_btn_id).attr("clicked", "true");
                            d3.select("#"+sister_btn_id).dispatch("click");
                        }
                        d3.select(this).attr("clicked", "false");
                    }
                });
                sub_main_div.append("br");

                sub_main_div.append("div")
                .attr("id", new_id+"_element")
                .style("display", "inline")
                .style("text-align", "left")
                .selectAll(".input_array"+new_id)
                .data(data_array)
                .enter()
                .append("input")
                .attr("class", "input_array"+new_id)
                .attr("type", "text")
                .style("border-radius", "6px")
                .style("background-color", "#404040")
                .style("color", "white")
                .attr("size", "5")
                .attr("value", function(d){
                    return d;
                })
                .on('change', function(d, i) {
                    console.log("changed t value");
                    let previous_array = that.deepCopy(array_div.datum().array);
                    previous_array[i] = parseFloat(d3.select(this).property('value'));
                    array_div.datum().array = previous_array;
                    d3.selectAll(".input_array"+new_id).data(previous_array);
                    that.setCopyObjStyle(style_key, previous_array);
                });

            } else if (subtype_str ===  "floatWString") {
                sub_main_div.append("input")
                .attr("type", "button")
                .style("border-radius", "6px")
                .style("color", "white")
                .style("background-color", "#404040")
                .style("font-size", "20px")
                .attr("id", new_id+"_add_btn")
                .attr("value", "+")
                .attr("clicked", "false")
                .on("click", function() {
                    let previous_array = that.deepCopy(array_div.datum().array);
                    previous_array.push(0.5);
                    array_div.datum().array = previous_array;
                    reDraw(current_obj,subtype_str, previous_array);
                    if (d3.select(this).attr("clicked") === "false") {
                        let sister_btn_id = current_obj.select_id.replaceAll(">", "_")+"_add_btn";
                        d3.select("#"+sister_btn_id).attr("clicked", "true");
                        d3.select("#"+sister_btn_id).dispatch("click");
                    }
                    d3.select(this).attr("clicked", "false");
                });
                sub_main_div.append("input")
                .attr("type", "button")
                .style("border-radius", "6px")
                .style("color", "white")
                .style("background-color", "#404040")
                .style("font-size", "20px")
                .attr("id", new_id+"_sub_btn")
                .attr("value", "-")
                .attr("clicked", "false")
                .on("click", function() {
                    let previous_array = that.deepCopy(array_div.datum().array);
                    if (previous_array.length > 2) {
                        previous_array.pop();
                        array_div.datum().array = previous_array;
                        reDraw(current_obj,subtype_str, previous_array);
                        if (d3.select(this).attr("clicked") === "false") {
                            let sister_btn_id = current_obj.select_id.replaceAll(">", "_")+"_sub_btn";
                            d3.select("#"+sister_btn_id).attr("clicked", "true");
                            d3.select("#"+sister_btn_id).dispatch("click");
                        }
                        d3.select(this).attr("clicked", "false");
                    }
                });
                sub_main_div.append("br");

                sub_main_div.append("div")
                .attr("id", new_id+"_element")
                .style("display", "inline")
                .style("text-align", "left")
                .selectAll(".input_array"+new_id)
                .data(data_array)
                .enter()
                .append("input")
                .attr("class", "input_array"+new_id)
                .attr("type", "text")
                .style("border-radius", "6px")
                .style("background-color", "#404040")
                .style("color", "white")
                .attr("size", "5")
                .attr("value", function(d){
                    return d;
                })
                .attr("previous_value", function(d){
                    return d;
                })
                .on('change', function(d, i) {
                    let current_value = d3.select(this).property("value");
                    let value_is_numeric = that.isNumeric(current_value);
                    if (current_obj.allow.indexOf(current_value) > -1 || value_is_numeric) {
                        if (value_is_numeric === true) {
                            current_value = parseFloat(current_value);
                        }
                        if (current_obj.bounds) {
                            if (parseFloat(current_value) < current_obj.bounds[0] || parseFloat(current_value) > current_obj.bounds[1]) {
                                let previous_value = d3.select(this).attr("previous_value");
                                d3.select(this).property("value", previous_value+"");
                                return;
                            }
                        }
                        d3.select(this).attr("previous_value", parseFloat(current_value));
                        let previous_array = that.deepCopy(array_div.datum().array);
                        previous_array[i] = parseFloat(d3.select(this).property('value'));
                        array_div.datum().array = previous_array;
                        d3.selectAll(".input_array"+new_id).data(previous_array);
                        that.setCopyObjStyle(style_key, previous_array);
                    } else {
                        let previous_value = d3.select(this).attr("previous_value");
                        d3.select(this).property("value", previous_value+"");
                    }
                });
            }
        }
        reDraw(current_obj, current_subtype, current_data_array);
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    isNumericInt(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    }

    createTextFloat(d3_element_parent, select_title, new_id, default_state, key_obj, add_br, style_key) {
        let that = this;
        let change_datum = {};
        change_datum.update_id = style_key;
        change_datum.allow = key_obj.allow;
        change_datum.bounds = key_obj.bounds;

        if (select_title.endsWith(":") === false && select_title.endsWith("?") === false) {
            select_title = select_title + ":"
        } 
        let text_div = d3_element_parent.append("div")

        text_div.append("span")
        .style("user-select", "none")
        .html(select_title);

        text_div.append("br")

        let sub_text_div = text_div.append("div")
        .style("text-align", "center");

        that.setCopyObjStyle(style_key, default_state);
        let text_input = sub_text_div.append("input")
        .datum(change_datum)
        .attr("id", new_id+"_element")
        .attr("type", "text")
        .style("border-radius", "6px")
        .style("background-color", "#404040")
        .style("color", "white")
        .attr("size", "5")
        .attr("value", default_state)
        .attr("previous_value", default_state)
        .on('change', function(d) {
            let current_value = d3.select(this).property("value");
            let value_is_numeric = that.isNumeric(current_value);
            if (d.allow.indexOf(current_value) > -1 || value_is_numeric) {
                if (value_is_numeric === true) {
                    current_value = parseFloat(current_value);
                }
                if (d.bounds) {
                    if (parseFloat(current_value) < d.bounds[0] || parseFloat(current_value) > d.bounds[1]) {
                        let previous_value = d3.select(this).attr("previous_value");
                        d3.select(this).property("value", previous_value+"");
                        return;
                    }
                }
                d3.select(this).attr("previous_value", parseFloat(current_value));
                that.setCopyObjStyle(style_key, current_value);
            } else {
                let previous_value = d3.select(this).attr("previous_value");
                d3.select(this).property("value", previous_value+"");
            }
        });
        if (add_br) {
            text_div.append("br");
        }
    }

    createText(d3_element_parent, select_title, new_id, default_state, add_br, style_key) {
        let change_datum = {};
        change_datum.update_id = style_key;

        if (select_title.endsWith(":") === false && select_title.endsWith("?") === false) {
            select_title = select_title + ":"
        } 

        let text_div = d3_element_parent.append("div")

        text_div.append("span")
        .style("user-select", "none")
        .html(select_title);

        text_div.append("br")

        let sub_text_div = text_div.append("div")
        .style("text-align", "center");

        let that = this;
        that.setCopyObjStyle(style_key, default_state);

        let text_input = sub_text_div.append("input")
        .datum(change_datum)
        .attr("id", new_id+"_element")
        .attr("type", "text")
        .style("border-radius", "6px")
        .style("background-color", "#404040")
        .style("color", "white")
        .attr("size", "5")
        .attr("value", default_state)
        .on('change', function(d) {
            console.log("changed text");
            let new_value = d3.select(this).property("value");
            that.setCopyObjStyle(style_key, new_value);
        });
        if (add_br) {
            text_div.append("br");
        }
    }

    deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    colorToRGB(color) {
        var cvs, ctx;
        cvs = document.createElement('canvas');
        cvs.height = 1;
        cvs.width = 1;
        ctx = cvs.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        // return "rgba(" + ctx.getImageData(0, 0, 1, 1).data + ")";
        let rgba_string = ctx.getImageData(0, 0, 1, 1).data+"";
        let rgba_array = rgba_string.split(",");
        let rgb_array = rgba_array.slice(0, rgba_array.length-1);
        let rgb_string = rgb_array.join(",");
        // return "rgb(" + rgb_string + ")";
        return rgb_array;
    }

    componentToHex(c) {
        c = parseInt(c);
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
      
    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    retrieveSubKeysHTMLObj(key) {
        if (key.includes(">") === false) {
            return Object.keys(this.style_obj_keys_to_html[key]);
        } else {
            let all_keys = key.split(">");
            let main_key = all_keys[0];
            all_keys = all_keys.slice(1);
            let current_style_obj = this.deepCopy(this.style_obj_keys_to_html[main_key]);
            for (let iak = 0; iak < all_keys.length; iak++) {
                let sub_key = all_keys[iak];
                if (current_style_obj.hasOwnProperty("subs")) {
                    current_style_obj = current_style_obj.subs[sub_key];
                } else {
                    current_style_obj = current_style_obj[sub_key];
                }
            }
            return Object.keys(current_style_obj);
        }
    }

    retrieveStyleHTMLFromKeys(key) {
        if (key.includes(">") === false) {
            return this.style_obj_keys_to_html[key];
        } else {
            let all_keys = key.split(">");
            let main_key = all_keys[0];
            all_keys = all_keys.slice(1);
            let current_style_obj = this.deepCopy(this.style_obj_keys_to_html[main_key]);
            for (let iak = 0; iak < all_keys.length; iak++) {
                let sub_key = all_keys[iak];
                if (current_style_obj.hasOwnProperty("subs")) {
                    current_style_obj = current_style_obj.subs[sub_key];
                } else {
                    current_style_obj = current_style_obj[sub_key];
                }
            }
            return current_style_obj;
        }
    }

    elementCreator(element_key, element_parent_id, element_original_key) {
        let key_obj = this.retrieveStyleHTMLFromKeys(element_key);
        if (!element_original_key) {
            element_original_key = element_key;
        }
        let element_parsed_key = element_key.replaceAll(">", "_");
        let select_element = d3.select("#"+ element_parent_id);

        if (key_obj.type === "dict") { //make display on/off div

            this.createDropDown(select_element, key_obj.title, element_parsed_key, false, "left", key_obj.pad, key_obj.cpad);
            let new_parent_id = element_parsed_key+"main_editor";
            let sub_keys = this.retrieveSubKeysStyleObj(element_key);
            for (let i_esk = 0; i_esk < sub_keys.length; i_esk++) {
                let sub_key = sub_keys[i_esk];
                let composed_key = element_key + ">" + sub_key;
                if (this.retrieveStyleHTMLFromKeys(composed_key) !== "skip") {
                    this.elementCreator(composed_key, new_parent_id);
                }
            }

        } else if (key_obj.type === "select") {

            let obj_in_style = this.retrieveSubObjStyleObj(element_original_key);
            this.createSelect(select_element, key_obj.title, element_parsed_key, key_obj.options, obj_in_style, key_obj.updatable, key_obj, element_key);

        } else if (key_obj.type === "relative_dict") {

            this.createDropDown(select_element, key_obj.title, element_parsed_key, false, "left", key_obj.pad, key_obj.cpad);
            let new_parent_id = element_parsed_key+"main_editor";
            let to_retrieve = key_obj.select_id;
            let obj_in_style = this.retrieveSubObjStyleObj(to_retrieve);
            let sub_keys = key_obj.subs[obj_in_style];

            for (let i_esk = 0; i_esk < sub_keys.length; i_esk++) {
                let sub_key = sub_keys[i_esk];
                let composed_key = element_key + ">" + sub_key;
                this.elementCreator(composed_key, new_parent_id);
            }

        } else if (key_obj.type === "float") {
            let obj_in_style = this.retrieveSubObjStyleObj(element_original_key);
            if (!obj_in_style || obj_in_style instanceof Object) {
                obj_in_style = key_obj.default;
            }
            this.createFloatSpinner(select_element, key_obj.title, element_parsed_key, obj_in_style,  key_obj.bounds, true, element_key);

        } else if (key_obj.type === "int") {

            let obj_in_style = this.retrieveSubObjStyleObj(element_original_key);
            if (!obj_in_style || obj_in_style instanceof Object) {
                obj_in_style = key_obj.default;
            }
            this.createIntSpinner(select_element, key_obj.title, element_parsed_key, obj_in_style,  key_obj.bounds,true, element_key);

        } else if (key_obj.type === "color") {

            let obj_in_style = this.retrieveSubObjStyleObj(element_original_key);
            if (!obj_in_style || obj_in_style instanceof Object) {
                obj_in_style = key_obj.default;
            }
            this.createColorInput(select_element, key_obj.title, element_parsed_key, obj_in_style, true, element_key);

        } else if (key_obj.type === "composed_dict") {
            if (key_obj.depth === 2) {
                let depth_1_lines_to_create = Object.keys(key_obj.subs).sort(function(a,b) {
                    return a-b;
                });
                let depth_2_columns_to_create = Object.keys(this.getObjsAtDepth(key_obj.subs, 1)).sort(function(a,b) {
                    return a-b;
                });
                let id_processed = element_parsed_key;
                id_processed = id_processed.replaceAll(">", "_");
                this.createDropDown(select_element, key_obj.title, id_processed, false, "left", key_obj.pad, key_obj.cpad);
                let id_processed_main = id_processed+"main_editor";
                let composed_div = d3.select("#"+id_processed_main);
                for (let i_lines = 0; i_lines < depth_1_lines_to_create.length; i_lines++) {
                    let current_line = depth_1_lines_to_create[i_lines];
                    //append p to parent div
                    let last_p = composed_div.append("p");
                    for (let i_cols = 0; i_cols < depth_2_columns_to_create.length; i_cols++) {
                        let current_column = depth_2_columns_to_create[i_cols];
                        let current_element = key_obj.subs[current_line][current_column];
                        //create span with element
                        let last_span_id = id_processed_main + "_l" + i_lines + "_c" + i_cols;
                        let last_span = last_p.append("span").attr("id", last_span_id);

                        let sub_key = current_line + ">" + current_column;
                        let composed_key = element_key + ">" + sub_key;
                        this.elementCreator(composed_key, last_span_id); 
                    }
                }

            } else if (key_obj.depth === 1) {
                let id_processed = element_parsed_key;
                id_processed = id_processed.replaceAll(">", "_");
                this.createDropDown(select_element, key_obj.title, id_processed, false, "left", key_obj.pad, key_obj.cpad);
                let id_processed_main = id_processed+"main_editor";
                let composed_div = d3.select("#"+id_processed_main);
                let last_p = composed_div.append("p");
                let depth_2_columns_to_create = Object.keys(key_obj.subs).sort(function(a,b) {
                    return a-b;
                });
                for (let i_cols = 0; i_cols < depth_2_columns_to_create.length; i_cols++) {
                    let current_column = depth_2_columns_to_create[i_cols];
                    let current_element = key_obj.subs[current_column];
                    //create span with element
                    let last_span_id = id_processed_main + "_c" + i_cols;
                    let last_span = last_p.append("span").attr("id", last_span_id);

                    let sub_key = current_column;
                    let composed_key = element_key + ">" + sub_key;
                    this.elementCreator(composed_key, last_span_id); 
                }
            }
        } else if (key_obj.type === "array") {
            let obj_in_style = this.retrieveSubObjStyleObj(element_original_key);
            if (!obj_in_style || obj_in_style instanceof Object) {
                obj_in_style = key_obj.default;
            }
            this.createArrayEditor(select_element, key_obj.title, element_parsed_key, obj_in_style, key_obj, true, element_key);
        } else if (key_obj.type === "boolean") {
            let obj_in_style = this.retrieveSubObjStyleObj(element_original_key);
            if (!obj_in_style || obj_in_style instanceof Object) {
                obj_in_style = key_obj.default;
            }
            this.createCheckBox(select_element, key_obj.title, element_parsed_key, obj_in_style, true, element_key);
        } else if (key_obj.type === "floatWString") {
            let obj_in_style = this.retrieveSubObjStyleObj(element_original_key);
            if (!obj_in_style || obj_in_style instanceof Object) {
                obj_in_style = key_obj.default;
            }
            this.createTextFloat(select_element, key_obj.title, element_parsed_key, obj_in_style, key_obj, true, element_key);
        } else if (key_obj.type === "arrayConnected") {
            let obj_in_style = this.retrieveSubObjStyleObj(element_original_key);
            if (!obj_in_style || obj_in_style instanceof Object) {
                obj_in_style = key_obj.default;
            }
            this.createConnectArray(select_element, key_obj.title, element_parsed_key, obj_in_style, key_obj, true, element_key);
        } else if (key_obj.type === "arrayConnectedAccording") {
            let obj_in_style = this.retrieveSubObjStyleObj(element_original_key);
            if (!obj_in_style || obj_in_style instanceof Object) {
                obj_in_style = key_obj.default;
            }
            this.createConnectArray(select_element, key_obj.title, element_parsed_key, obj_in_style, key_obj, true, element_key);
        } else if (key_obj.type === "text") {
            let obj_in_style = this.retrieveSubObjStyleObj(element_original_key);
            if (!obj_in_style || obj_in_style instanceof Object) {
                obj_in_style = key_obj.default;
            }
            this.createText(select_element, key_obj.title, element_parsed_key, obj_in_style, true, element_key);
        }
    }

    getObjsAtDepth(dict, depth) {
        let current_depth = 1;
        let current_dict = this.deepCopy(dict);
        while(current_depth <= depth) {
            let current_dict_keys = Object.keys(current_dict);
            current_dict = current_dict[current_dict_keys[0]];
            current_depth += 1;   
        }
        return current_dict;
    }

    sendToNaViewObj() {
        this.naview_obj.setStyleObjResetView(this.style_obj_copy);
    }

    downloadStyleObject() {
        let text = JSON.stringify(this.style_obj_copy);
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', "style_obj.txt");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    downloadImage(format) {
        let fname = prompt("Enter image file name:", "image."+format);
        if (fname) {
            let svgid = this.naview_obj.getSvgId();
            let svg_data = document.getElementById(svgid).innerHTML;
            let svg_w = d3.select("#"+svgid).attr("width");
            let svg_h = d3.select("#"+svgid).attr("height");
            let head = '<svg title="plot" version="1.1" xmlns="http://www.w3.org/2000/svg" width="'+svg_w+'px" height="'+svg_h+'px" >'

            let full_svg = head + svg_data + "</svg>"

            var DOMURL = window.URL || window.webkitURL || window;
            let blob = new Blob([full_svg], {type: "image/svg+xml;charset=utf-8'"});  
            var blob_data = DOMURL.createObjectURL(blob);
            var click_evt = new MouseEvent('click', {
                view: window,
                bubbles: false,
                cancelable: true
            });
            var element = document.createElement('a');
            element.setAttribute('download', fname);
            if (format === "svg") {
                element.setAttribute('href', blob_data);
                element.dispatchEvent(click_evt);
                DOMURL.revokeObjectURL(blob_data);
            } else if (format === "png") {
                var canvas = document.createElement('canvas');
                canvas.width  = svg_w;
                canvas.height = svg_h;
                var ctx = canvas.getContext('2d');
                var img = new Image();
                img.onload = function () {
                    ctx.drawImage(img, 0, 0);
                    DOMURL.revokeObjectURL(blob_data);
                    var imgURI = canvas
                    .toDataURL('image/png')
                    .replace('image/png', 'image/octet-stream');
                    element.setAttribute('href', imgURI);
                    element.dispatchEvent(click_evt);
                }
                img.src = blob_data;
            }
        }
    }

    openConsole() {
        let console_select =  d3.select("#"+this.console_id);
        if (console_select.size() === 0) {
            this.console_status = false;
        } else {
            this.console_status = true;
        }
        if (this.console_status === false) {
            this.createConsole();
            this.console_status = true;
        }
        //creates console div as absolute end of plot
        //allows input of: TEXT
        //allows input of: RELATION
        //allows input of: COLOR RULE
        //allows input of: PROPERTY
    }

    createConsole() {
        let that = this;
        let div_selection = d3.select("#"+this.console_id);
        if (div_selection.size() === 0) {
            let svg_box = document.getElementById(this.naview_obj.getSvgId()).getBoundingClientRect();
            div_selection = d3.select("body").append("div").attr("id", this.console_id);
            div_selection.style("position", "absolute");
            // div_selection.style("top", (svg_box.top+((svg_box.height*3)/4))+"px");
            div_selection.style("top", (svg_box.top+(svg_box.height*0.9))+"px");
            // div_selection.style("left", "80%");
            // div_selection.style("left", (svg_box.left+(svg_box.width/4))+"px");
            div_selection.style("left", svg_box.left+"px");
            div_selection.style("z-index", "7");
            // div_selection.style("max-width", (0.8*svg_box.width)+"px");
            // div_selection.style("min-width", (0.8*svg_box.width)+"px");
            div_selection.style("max-width", (0.85*svg_box.width)+"px");
            div_selection.style("min-width", (0.85*svg_box.width)+"px");
            div_selection.style("background-color", "#000000bf");
            div_selection.style("font-family", "monospace");
            div_selection.style("font-size", "15px");
            div_selection.style("color", "white");
            // div_selection.style("max-height", "10%");
            div_selection.style("min-height", "10%");

            this.console_type = "Text";
            this.buildConsole();
        }
    }

    buildConsole() {
        let that = this;
        let div_selection = d3.select("#"+this.console_id);
        div_selection.html("");
        let f_div = div_selection.append("div")
        .style("text-align", "center");

        f_div.append("div")
        .style("text-align", "right")
        .append("span")
        .attr("id", this.console_id+"close")
        .style("cursor", "pointer")
        .style("user-select", "none")
        .html("&#10006;")
        .on("click", function() {
            that.console_status = false;
            d3.select("#"+ that.console_id).remove();
        });

        f_div.append("span").html("Currently Editing:")

        let console_select = f_div.append("span")
        .append("select")
        .attr("id", that.console_id+"_select_type")
        .style("border-radius", "6px")
        .style("background-color", "#404040")
        .style("color", "white")
        .style("margin", "5px")
        .style("padding", "2px")
        .style("font-size", "15px")
        .style("min-width", "20%")
        .style("font-family", "monospace")
        .on('change', function() {
            var new_value = d3.select(this).property('value');
            that.console_type = new_value;
            that.buildConsole();
        });

        let console_options = ["Text", "Color"];
        for (let ico = 0; ico < console_options.length; ico++) {
            let option_string = console_options[ico];
            let opt_el = console_select.append("option")
            .attr("value", option_string)
            .html(option_string);
            if (option_string === that.console_type) {
                opt_el.attr("selected", "selected");
            }
        }

        div_selection.append("br");
        let s_div = div_selection.append("div");
        /**
         * TEXT
         * TEXT
         */
        if (this.console_type === "Text") {
            let text_select = s_div.append("select")
            .attr("id", that.console_id+"_text_select_type")
            .style("border-radius", "6px")
            .style("background-color", "#404040")
            .style("color", "white")
            .style("margin", "5px")
            .style("padding", "2px")
            .style("font-size", "15px")
            .style("font-family", "monospace")
            .style("display", "inline")
            .on('change', function() {
                var new_value = d3.select(this).property('value');
                buildTextOrProp(new_value);
            });
    
            let text_options = ["Text-Based", "Property-Based"];
            for (let ico = 0; ico < text_options.length; ico++) {
                let option_string = text_options[ico];
                let opt_el = text_select.append("option")
                .attr("value", option_string)
                .html(option_string);
                if (option_string === "Text-Based") {
                    opt_el.attr("selected", "selected");
                }
            }

            let text_build_div = s_div.append("div").attr("id", "text_build_div").style("display", "inline");
            
            function buildTextOrProp(option_string) {
                let select_text_build_div = d3.select("#text_build_div");
                select_text_build_div.html("");
                if (option_string === "Text-Based") {
                    d3.select("#"+that.console_id+"_text_select_pos").attr('disabled', null);
                    select_text_build_div
                    .append("span")
                    .style("display", "inline")
                    .html("Text:");
                    select_text_build_div
                    .append("input")
                    .attr("id", "text_build_div_text")
                    .attr("type", "text")
                    .style("display", "inline")
                    .style("border-radius", "6px")
                    .style("background-color", "#404040")
                    .style("color", "white")
                    .attr("size", "5")
                    .attr("value", "")
                    // .on('change', function() {
                    // })
                    ;
                } else if (option_string === "Property-Based") {
                    buildPositioning("Element-Centered");
                    d3.select("#"+that.console_id+"_text_select_pos").property("value", "Element-Centered");
                    d3.select("#"+that.console_id+"_text_select_pos").attr('disabled', true);

                    select_text_build_div
                    .append("span")
                    .attr("id","text_build_div_span")
                    .datum({"props":[]})
                    .style("display", "inline")
                    .html("Properties:");

                    select_text_build_div.append("input")
                    .attr("type", "button")
                    .style("border-radius", "6px")
                    .style("color", "white")
                    .style("background-color", "#404040")
                    .style("font-size", "15px")
                    .style("display", "inline")
                    .attr("value", "Add Text")
                    .on("click", function() {
                        let txt = prompt("Enter text to append:", "");
                        let propsd = that.deepCopy(d3.select("#text_build_div_span").datum());
                        propsd.props.push(txt);
                        d3.select("#text_build_div_span").datum(propsd);
                    });

                    select_text_build_div.append("input")
                    .attr("type", "button")
                    .style("border-radius", "6px")
                    .style("color", "white")
                    .style("background-color", "#404040")
                    .style("font-size", "15px")
                    .style("display", "inline")
                    .attr("value", "Add Prop.")
                    .on("click", function() {
                        let modal = d3.select("body")
                        .append("div")
                        .attr("id", "modal_s")
                        .style("position", "fixed") /* Stay in place */
                        .style("z-index", "10") /* Sit on top */
                        .style("padding-top", "100px") /* Location of the box */
                        .style("left", "0")
                        .style("top", "0")
                        .style("width", "100%") /* Full width */
                        .style("height", "100%") /* Full height */
                        .style("overflow", "auto") /* Enable scroll if needed */
                        .style("background-color", "rgb(0,0,0)")   /* Fallback color */
                        .style("background-color", "rgba(0,0,0,0.4)");     /* Black w/ opacity */

                        let modal_div = modal.append("div")
                        .style("text-align", "center")
                        .style("background-color", "#fefefe")   /* Fallback color */
                        .style("margin", "auto")
                        .style("padding", "20px") /* Location of the box */
                        .style("border", "1px solid #888")
                        .style("width", "80%");

                        modal_div.append("span")
                        .html("&times;")
                        .style("color", "black")
                        .style("float", "right")
                        .style("font-size", "28px")
                        .style("font-weight", "bold")
                        .on("click", function () {
                            // let txt = d3.select("#modal_select").property("value");
                            // let propsd = d3.select("#text_build_div_span").datum();
                            // propsd.props.push(txt);
                            // d3.select("#text_build_div_span").datum(propsd);
                            d3.select("#modal_s").remove();
                        });

                        modal_div.append("p")
                        .html("Please select property to append:")
                        ;

                        let text_options3 = Object.values(that.naview_obj.getElementNamesCentroids()).map(function(a) {
                            return Object.keys(a);
                        });
                        text_options3 = text_options3[0];

                        let not_allowed = ["id","type","dom_name","dom_iname","dom_itype","path_data", "point", "stroke", "fill", "opacity", "stroke_size", "circle_radius", "stroke_width", "centroid", "path_piece_pts"];
                        text_options3 = text_options3.filter(function(a) {
                            return not_allowed.indexOf(a) === -1;
                        });
                        let props_dict = {
                            "res_ind": "Residue Index",
                            "resname": "Residue Name",
                            "dom_aname": "Domain Name",
                            "res_1": "Residue 1-Letter Type",
                            "res_3": "Residue 3-Letter Type",
                        }
                        text_options3 = text_options3.map(function(a) {
                            return props_dict[a];
                        });
                        let all_props = Object.values(that.naview_obj.getCurrentProperties()).map(function(a) {
                            return Object.keys(a);
                        });
                        all_props = all_props[0];
                        if (all_props) {
                            text_options3.push(...all_props);
                        }
                        console.log("text_options3");
                        console.log(text_options3);

                        let modal_selects = modal_div.append("select")
                        .attr("id", "modal_select")
                        .style("margin", "5px")
                        .style("min-width", "20%")
                        .style("font-size", "15px")
                        .style("padding", "2px");
                        
                        for (let ico = 0; ico < text_options3.length; ico++) {
                            let option_string = text_options3[ico];
                            let opt_el = modal_selects.append("option")
                            .attr("value", option_string)
                            .html(option_string);
                            if (ico === 0) {
                                opt_el.attr("selected", "selected");
                            }
                        }
                        modal_div.append("br")
                        modal_div.append("button")
                        .html("OK")
                        .on("click", function () {
                            let props_revdict = {
                                "Residue Index": "res_ind",
                                "Residue Name": "resname",
                                "Domain Name": "dom_aname",
                                "Residue 1-Letter Type": "res_1",
                                "Residue 3-Letter Type": "res_3",
                            }
                            let txt = d3.select("#modal_select").property("value");
                            if (props_revdict.hasOwnProperty(txt)) {
                                txt = props_revdict[txt];
                            }
                            let propsd = d3.select("#text_build_div_span").datum();
                            propsd.props.push(txt);
                            d3.select("#text_build_div_span").datum(propsd);
                            d3.select("#modal_s").remove();
                        });
                    });

                    select_text_build_div.append("input")
                    .attr("type", "button")
                    .style("border-radius", "6px")
                    .style("color", "white")
                    .style("background-color", "#404040")
                    .style("font-size", "15px")
                    .style("display", "inline")
                    .attr("value", "Reset")
                    .on("click", function() {
                        let propsd = that.deepCopy(d3.select("#text_build_div_span").datum());
                        propsd.props = [];
                        d3.select("#text_build_div_span").datum(propsd);
                    });

                }
            }
            buildTextOrProp("Text-Based");
            // text_select.dispatch("change");

            let text_select_pos = s_div.append("select")
            .attr("id", that.console_id+"_text_select_pos")
            .style("border-radius", "6px")
            .style("background-color", "#404040")
            .style("color", "white")
            .style("margin", "5px")
            .style("padding", "2px")
            .style("font-size", "15px")
            .style("font-family", "monospace")
            .style("display", "inline")
            .on('change', function() {
                var new_value = d3.select(this).property('value');
                buildPositioning(new_value);
            });
    
            let text_options2 = ["Absolute", "Element-Centered"];
            for (let ico = 0; ico < text_options2.length; ico++) {
                let option_string = text_options2[ico];
                let opt_el = text_select_pos.append("option")
                .attr("value", option_string)
                .html(option_string);
                if (option_string === "Absolute") {
                    opt_el.attr("selected", "selected");
                }
            }

            let text_build_div2 = s_div.append("div").attr("id", "text_build_div2").style("display", "inline");
            function buildPositioning(option_string) {
                let select_text_build_div = d3.select("#text_build_div2");
                select_text_build_div.html("");
                if (option_string === "Absolute") {
                    select_text_build_div
                    .append("span")
                    .style("display", "inline")
                    .html("X Pos:");
                    select_text_build_div
                    .append("input")
                    .attr("id", "text_build_div2_x")
                    .attr("type", "number")
                    .attr("step", 1)
                    .attr("min", 0)
                    .attr("max", d3.select("#"+that.naview_obj.getSvgId()).attr("width"))
                    .attr("value", 1)
                    .style("display", "inline")
                    .style("border-radius", "6px")
                    .style("background-color", "#404040")
                    .style("color", "white")
                    .style("width", "4.5em");

                    select_text_build_div
                    .append("span")
                    .style("display", "inline")
                    .html("Y Pos:");
                    select_text_build_div
                    .append("input")
                    .attr("id", "text_build_div2_y")
                    .attr("type", "number")
                    .attr("step", 1)
                    .attr("min", 0)
                    .attr("max", d3.select("#"+that.naview_obj.getSvgId()).attr("height"))
                    .attr("value", 1)
                    .style("display", "inline")
                    .style("border-radius", "6px")
                    .style("background-color", "#404040")
                    .style("color", "white")
                    .style("width", "4.5em");

                } else if (option_string === "Element-Centered") {
                    select_text_build_div
                    .append("span")
                    .style("display", "inline")
                    .html("Element:");

                    let select_elements2 = select_text_build_div.append("select")
                    .attr("id", "text_build_div2_element")
                    .style("border-radius", "6px")
                    .style("background-color", "#404040")
                    .style("color", "white")
                    .style("margin", "5px")
                    .style("padding", "2px")
                    .style("font-size", "15px")
                    .style("font-family", "monospace")
                    .style("display", "inline");
        
                    // let text_options3 = Object.keys(that.naview_obj.getElementNamesCentroids());
                    let text_options3 = Object.values(that.naview_obj.getElementNamesCentroids()).map(function(a) {
                        if (a.hasOwnProperty("resname")) {
                            return a.resname;
                        } else {
                            return a.elname;
                        }
                    });
                    for (let ico = 0; ico < text_options3.length; ico++) {
                        let option_string = text_options3[ico];
                        let opt_el = select_elements2.append("option")
                        .attr("value", option_string)
                        .html(option_string);
                        if (ico === 0 ) {
                            opt_el.attr("selected", "selected");
                        }
                    }
                }
            }
            buildPositioning("Absolute");

            s_div
            .append("span")
            .style("display", "inline")
            .html("dX Pos:");

            s_div
            .append("input")
            .attr("id", "text_build_dx")
            .attr("type", "number")
            .attr("step", 1)
            .attr("min", 0)
            .attr("max", d3.select("#"+that.naview_obj.getSvgId()).attr("width"))
            .attr("value", 0)
            .style("display", "inline")
            .style("border-radius", "6px")
            .style("background-color", "#404040")
            .style("color", "white")
            .style("width", "4.5em");

            s_div
            .append("span")
            .style("display", "inline")
            .html("dY Pos:");

            s_div
            .append("input")
            .attr("id", "text_build_dy")
            .attr("type", "number")
            .attr("step", 1)
            .attr("min", 0)
            .attr("max", d3.select("#"+that.naview_obj.getSvgId()).attr("height"))
            .attr("value", 0)
            .style("display", "inline")
            .style("border-radius", "6px")
            .style("background-color", "#404040")
            .style("color", "white")
            .style("width", "4.5em");

            s_div.append("input")
            .attr("type", "button")
            .style("border-radius", "6px")
            .style("color", "white")
            .style("background-color", "#404040")
            .style("font-size", "15px")
            .style("display", "inline")
            .attr("value", "Draw Text")
            .on("click", function() {
                //add text to plot
                let text_element = {};
                if (d3.select("#"+that.console_id+"_text_select_type").property('value') === "Text-Based") {
                    text_element['text'] = d3.select("#text_build_div_text").property('value');
                } else {
                    text_element['props'] = d3.select("#text_build_div_span").datum().props;
                }
                text_element['positioning'] = {};
                if (d3.select("#"+that.console_id+"_text_select_pos").property('value') === "Absolute") {
                    // text_element['text'] = d3.select("#text_build_div_text").property('value');
                    text_element['positioning']['type'] = "absolute";
                    text_element['positioning']['x'] = parseFloat(d3.select("#text_build_div2_x").property('value'));
                    text_element['positioning']['y'] = parseFloat(d3.select("#text_build_div2_y").property('value'));
                } else {
                    text_element['positioning']['type'] = "residue_or_element";
                    text_element['positioning']['reference'] = d3.select("#text_build_div2_element").property('value');
                }
                text_element['positioning']["dx"] = parseFloat(d3.select("#text_build_dx").property("value"));
                text_element['positioning']["dy"] = parseFloat(d3.select("#text_build_dy").property("value"));

                let old_text_rules = that.deepCopy(that.naview_obj.getTextRules());
                old_text_rules.push(text_element);
                that.naview_obj.setTextRulesAndReRender(old_text_rules);
            });

            s_div.append("input")
            .attr("type", "button")
            .style("border-radius", "6px")
            .style("color", "white")
            .style("background-color", "#404040")
            .style("font-size", "15px")
            .style("display", "inline")
            .attr("value", "Reset All")
            .on("click", function() {
                that.naview_obj.setTextRulesAndReRender([]);
            });

        } else if (this.console_type === "Color") {
            s_div
            .append("span")
            .style("display", "inline")
            .html("Current Color Rule:");

            s_div
            .append("input")
            .attr("id", "text_build_div_text")
            .attr("type", "text")
            .style("display", "inline")
            .style("border-radius", "6px")
            .style("background-color", "#404040")
            .style("color", "white")
            .attr("value", "")
            .style("width", "40%")
            .property("disabled", true)
            ;

            s_div.append("input")
            .attr("type", "button")
            .style("border-radius", "6px")
            .style("color", "white")
            .style("background-color", "#404040")
            .style("font-size", "15px")
            .style("display", "inline")
            .attr("value", "Add Selection")
            .on("click", function() {
                let modal = d3.select("body")
                .append("div")
                .attr("id", "modal_s")
                .style("position", "fixed") /* Stay in place */
                .style("z-index", "10") /* Sit on top */
                .style("padding-top", "100px") /* Location of the box */
                .style("left", "0")
                .style("top", "0")
                .style("width", "100%") /* Full width */
                .style("height", "100%") /* Full height */
                .style("overflow", "auto") /* Enable scroll if needed */
                .style("background-color", "rgb(0,0,0)")   /* Fallback color */
                .style("background-color", "rgba(0,0,0,0.4)");     /* Black w/ opacity */

                let modal_div = modal.append("div")
                .style("text-align", "center")
                .style("background-color", "#fefefe")   /* Fallback color */
                .style("margin", "auto")
                .style("padding", "20px") /* Location of the box */
                .style("border", "1px solid #888")
                .style("width", "80%");

                modal_div.append("span")
                .html("&times;")
                .style("color", "black")
                .style("float", "right")
                .style("font-size", "28px")
                .style("font-weight", "bold")
                .on("click", function () {
                    // let txt = d3.select("#modal_select").property("value");
                    // let propsd = d3.select("#text_build_div_span").datum();
                    // propsd.props.push(txt);
                    // d3.select("#text_build_div_span").datum(propsd);
                    d3.select("#modal_s").remove();
                });

                modal_div.append("p")
                .html("Please choose Selection Key:")
                ;

                let all_ids = that.naview_obj.getParsedProteinData().map(function(a) {
                    return a.id
                });
                let all_resids = that.naview_obj.getAllResids();
                let all_resids_idx = [""];
                all_resids_idx.push(...that.deepCopy(all_resids));

                let selection_key_types = {
                    "ALL":{"specifier": [], "additional":[]},
                    "Helix:":{"specifier":[], "additional":[1,2,3,4,5,6]},
                    "Loop:":{"specifier":[], "additional":[1,2,3,4,5,6]},
                    "Id:":{"specifier":[], "additional":all_ids},
                    "Domain:":{"specifier":[], "additional":["I","II","III","IV"]},
                    "1-Letter Amino Acid":{"specifier":Object.keys(that.naview_obj.getOneToThree()), "additional":all_resids_idx},
                    "3-Letter Amino Acid":{"specifier":Object.keys(that.naview_obj.getThreeToOne()), "additional":all_resids_idx},
                    "resid":{"specifier":[""], "additional":all_resids}
                };

                let all_props = Object.values(that.naview_obj.getCurrentProperties()).map(function(a) {
                    return Object.keys(a);
                });
                all_props = all_props[0];
                let text_options3 = Object.keys(selection_key_types);

                let modal_selects = modal_div.append("select")
                .attr("id", "modal_select")
                .datum({"value":text_options3[0]})
                .style("margin", "5px")
                .style("min-width", "20%")
                .style("font-size", "15px")
                .style("padding", "2px")
                .on("change", function() {
                    let curval = d3.select(this).property("value");
                    let build_more = d3.select("#color_div_select_more");
                    build_more.html("");
                    let more_data = selection_key_types[curval];
                    if (more_data.specifier.length === 1) {
                        let oda = d3.select(this).datum();
                        oda.value = "";
                        d3.select(this).datum(oda);
                    } else if (more_data.specifier.length > 1) {
                        let text_options5 = more_data.specifier;
                        let oda = d3.select(this).datum();
                        oda.value = text_options5[0];
                        d3.select(this).datum(oda);
                        build_more.append("p").html("Please Specify the Selection Kind");
                        let modal_selects3 = build_more.append("select")
                        .attr("id", "modal_select3")
                        .datum({"value":text_options5[0]})
                        .style("margin", "5px")
                        .style("min-width", "20%")
                        .style("font-size", "15px")
                        .style("padding", "2px")
                        .on("change", function(){
                            let curval2 = d3.select(this).property("value");
                            let oda = d3.select("#modal_select").datum();
                            oda.value = curval2;
                            d3.select("#modal_select").datum(oda);
                        });
                        for (let ico = 0; ico < text_options5.length; ico++) {
                            let option_string = text_options5[ico];
                            let opt_el = modal_selects3.append("option")
                            .attr("value", option_string)
                            .html(option_string);
                            if (ico === 0) {
                                opt_el.attr("selected", "selected");
                            }
                        }
                    } else {
                        let oda = d3.select(this).datum();
                        oda.value = curval;
                        d3.select(this).datum(oda);
                    }
                    if (more_data.additional.length > 0) {
                        let text_options4 = more_data.additional;
                        build_more.append("p").html("Please Specify the Selection Index");
                        let modal_selects2 = build_more.append("select")
                        .attr("id", "modal_select2")
                        .datum({"value":text_options4[0]})
                        .style("margin", "5px")
                        .style("min-width", "20%")
                        .style("font-size", "15px")
                        .style("padding", "2px")
                        .on("change", function() {
                            let curval3 = d3.select("#modal_select2").property("value");
                            let oda2 = d3.select("#modal_select2").datum();
                            oda2.value = curval3;
                            d3.select("#modal_select2").datum(oda2);
                        });
                        for (let ico = 0; ico < text_options4.length; ico++) {
                            let option_string = text_options4[ico];
                            let opt_el = modal_selects2.append("option")
                            .attr("value", option_string)
                            .html(option_string);
                            if (ico === 0) {
                                opt_el.attr("selected", "selected");
                            }
                        }
                    }
                })
                ;

                for (let ico = 0; ico < text_options3.length; ico++) {
                    let option_string = text_options3[ico];
                    let opt_el = modal_selects.append("option")
                    .attr("value", option_string)
                    .html(option_string);
                    if (ico === 0) {
                        opt_el.attr("selected", "selected");
                    }
                }
                modal_div.append("br")
                modal_div.append("div")
                .attr('id', "color_div_select_more");

                modal_div.append("br")
                modal_div.append("button")
                .html("OK")
                .on("click", function () {
                    let first_value = d3.select("#modal_select").datum().value;
                    if (d3.select("#modal_select2").size() > 0) {
                        let d2 = d3.select("#modal_select2").datum().value;
                        first_value = first_value + d2;
                    }
                    //add selection to rule
                    let current_rule_value = d3.select("#text_build_div_text").property("value");
                    if (current_rule_value) {
                        let header_rule = current_rule_value.split(",")[0];
                        let remaining = current_rule_value.split(",").slice(1);
                        remaining = remaining.join(",");
                        header_rule = header_rule + "&" + first_value;
                        current_rule_value = header_rule+remaining;
                    } else {
                        current_rule_value = first_value;
                    }
                    d3.select("#text_build_div_text").property("value", current_rule_value);

                    d3.select("#modal_s").remove();
                });
            });

            s_div.append("input")
            .attr("type", "button")
            .style("border-radius", "6px")
            .style("color", "white")
            .style("background-color", "#404040")
            .style("font-size", "15px")
            .style("display", "inline")
            .attr("value", "Add Color")
            .on("click", function() {
                let modal = d3.select("body")
                .append("div")
                .attr("id", "modal_s")
                .style("position", "fixed") /* Stay in place */
                .style("z-index", "10") /* Sit on top */
                .style("padding-top", "100px") /* Location of the box */
                .style("left", "0")
                .style("top", "0")
                .style("width", "100%") /* Full width */
                .style("height", "100%") /* Full height */
                .style("overflow", "auto") /* Enable scroll if needed */
                .style("background-color", "rgb(0,0,0)")   /* Fallback color */
                .style("background-color", "rgba(0,0,0,0.4)");     /* Black w/ opacity */

                let modal_div = modal.append("div")
                .style("text-align", "center")
                .style("background-color", "#fefefe")   /* Fallback color */
                .style("margin", "auto")
                .style("padding", "20px") /* Location of the box */
                .style("border", "1px solid #888")
                .style("width", "80%");

                modal_div.append("span")
                .html("&times;")
                .style("color", "black")
                .style("float", "right")
                .style("font-size", "28px")
                .style("font-weight", "bold")
                .on("click", function () {
                    // let txt = d3.select("#modal_select").property("value");
                    // let propsd = d3.select("#text_build_div_span").datum();
                    // propsd.props.push(txt);
                    // d3.select("#text_build_div_span").datum(propsd);
                    d3.select("#modal_s").remove();
                });

                modal_div.append("p")
                .html("Please select Color mode:")
                ;

                let modal_selects = modal_div.append("select")
                .attr("id", "modal_select")
                .style("margin", "5px")
                .style("min-width", "20%")
                .style("font-size", "15px")
                .style("padding", "2px");
                
                let color_opts = ["Single Color", "Map to Property"];
                for (let ico = 0; ico < color_opts.length; ico++) {
                    let option_string = color_opts[ico];
                    let opt_el = modal_selects.append("option")
                    .attr("value", option_string)
                    .html(option_string);
                    if (ico === 0) {
                        opt_el.attr("selected", "selected");
                    }
                }

                let color_opts_div = modal_div.append("div")
                .attr("id", "color_opts_div")
                .datum({"color":"#ffffff"});

                modal_selects.on("change", function() {
                    console.log("changed modal");
                    let color_opts_div = d3.select("#color_opts_div");
                    color_opts_div.html("");
                    let valuec = d3.select("#modal_select").property("value");
                    console.log("valuec");
                    console.log(valuec);
                    if (valuec === "Single Color") {
                        //create color map
                        color_opts_div
                        .append("input")
                        .attr("id", "color_selector")
                        .attr("type","color")
                        .style("border-radius", "3px")
                        .style("background-color", "#ffffff00")
                        .style("padding", "0px")
                        .style("width", "4em")
                        .style("height", "2em")
                        .style("border-color", "#ffffff00")
                        .attr("value", function(){return color_opts_div.datum().color})
                        .on("change", function() {
                            let value2 = d3.select("#color_selector").property("value");
                            let pdatum = d3.select("#color_opts_div").datum();
                            pdatum.color = value2;
                            d3.select("#color_opts_div").datum(pdatum);
                        });
                    } else if (valuec === "Map to Property") {
                        let all_props = Object.values(that.naview_obj.getCurrentProperties()).map(function(a) {
                            return Object.keys(a);
                        });
                        all_props = all_props[0];
                        if (all_props) {
                            if (all_props.length > 0) {
                                color_opts_div.append("p").html("Select Property");

                                let modal_selects2a = color_opts_div.append("select")
                                .attr("id", "modal_selects2a")
                                .datum({"range":["#ADD8E6","#0000FF"],"domain":["min","max"], "property":all_props[0]})
                                .style("margin", "5px")
                                .style("min-width", "20%")
                                .style("font-size", "15px")
                                .style("padding", "2px");
                                let color_opts2 = all_props;
                                for (let ico = 0; ico < color_opts2.length; ico++) {
                                    let option_string = color_opts2[ico];
                                    let opt_el = modal_selects2a.append("option")
                                    .attr("value", option_string)
                                    .html(option_string);
                                    if (ico === 0) {
                                        opt_el.attr("selected", "selected");
                                    }
                                }
                                modal_selects2a.on("change", function() {
                                    let curval2a = d3.select("#modal_selects2a").property("value");
                                    let olddat = d3.select("#modal_selects2a").datum();
                                    olddat.property = curval2a;
                                    d3.select("#modal_selects2a").datum(olddat);
                                });
                                color_opts_div.append("p").html("Set Color Range");
                                color_opts_div.append("input")
                                .attr("id", "crange_add")
                                .attr("type","button")
                                .attr("clicked", "false")
                                .attr("value", "Add Range")
                                .on("click", function() {
                                    let o_datum = d3.select("#modal_selects2a").datum();
                                    let old_range = o_datum.range;
                                    old_range.push("#ffffff");
                                    o_datum.range = old_range;
                                    d3.select("#modal_selects2a").datum(o_datum);
                                    if (d3.select(this).attr("clicked") === "false") {
                                        let sister_btn_id = "cdomain_add";
                                        d3.select("#"+sister_btn_id).attr("clicked", "true");
                                        d3.select("#"+sister_btn_id).dispatch("click");
                                    }
                                    d3.select(this).attr("clicked", "false");
                                    drawColorRange();
                                });
                                color_opts_div.append("input")
                                .attr("id", "crange_remove")
                                .attr("type","button")
                                .attr("clicked", "false")
                                .attr("value", "Del Range")
                                .on("click", function() {
                                    let o_datum = d3.select("#modal_selects2a").datum();
                                    let old_range = o_datum.range;
                                    if (old_range.length > 2) {
                                        old_range.pop();
                                        o_datum.range = old_range;
                                        d3.select("#modal_selects2a").datum(o_datum);
                                        if (d3.select(this).attr("clicked") === "false") {
                                            let sister_btn_id = "cdomain_remove";
                                            d3.select("#"+sister_btn_id).attr("clicked", "true");
                                            d3.select("#"+sister_btn_id).dispatch("click");
                                        }
                                    }
                                    d3.select(this).attr("clicked", "false");
                                    drawColorRange();
                                });
                                color_opts_div.append("div").attr("id", "color_opts_div_ranges");
                                function drawColorRange() {
                                    let color_opts_div2 = d3.select("#color_opts_div_ranges");
                                    color_opts_div2.html("");
                                    let range_datum = d3.select("#modal_selects2a").datum().range;
                                    for (let ird = 0; ird < range_datum.length; ird++) {
                                        let range_val = range_datum[ird];
                                        color_opts_div2.append("input")
                                        .attr("type", "color")
                                        .attr("id", function(){return "colrange"+ird;})
                                        .datum({"ind":ird})
                                        .attr("value", function(d){
                                            let o_datum = d3.select("#modal_selects2a").datum();
                                            let old_range = o_datum.range;
                                            return old_range[d.ind];
                                        })
                                        .style("border-radius", "3px")
                                        .style("background-color", "#ffffff00")
                                        .style("padding", "0px")
                                        .style("width", "4em")
                                        .style("height", "2em")
                                        .style("border-color", "#ffffff00")
                                        .on("change", function(d) {
                                            let tcoval = d3.select("#colrange"+d.ind).property("value");
                                            let o_datum = d3.select("#modal_selects2a").datum();
                                            let old_range = o_datum.range;
                                            old_range[d.ind] = tcoval;
                                            o_datum.range = old_range;
                                            d3.select("#modal_selects2a").datum(o_datum);
                                        });
                                    }
                                }
                                drawColorRange();

                                color_opts_div.append("p").html("Select Property Domain");
                                color_opts_div.append("input")
                                .attr("id", "cdomain_add")
                                .attr("type","button")
                                .attr("clicked", "false")
                                .attr("value", "Add Domain")
                                .on("click", function() {
                                    let o_datum = d3.select("#modal_selects2a").datum();
                                    let old_range = o_datum.domain;
                                    old_range.push(0.5);
                                    o_datum.domain = old_range;
                                    d3.select("#modal_selects2a").datum(o_datum);
                                    if (d3.select(this).attr("clicked") === "false") {
                                        let sister_btn_id = "crange_add";
                                        d3.select("#"+sister_btn_id).attr("clicked", "true");
                                        d3.select("#"+sister_btn_id).dispatch("click");
                                    }
                                    d3.select(this).attr("clicked", "false");
                                    drawColorDomain();
                                });
                                color_opts_div.append("input")
                                .attr("id", "cdomain_remove")
                                .attr("type","button")
                                .attr("clicked", "false")
                                .attr("value", "Del Domain")
                                .on("click", function() {
                                    let o_datum = d3.select("#modal_selects2a").datum();
                                    let old_range = o_datum.domain;
                                    if (old_range.length > 2) {
                                        old_range.pop();
                                        o_datum.domain = old_range;
                                        d3.select("#modal_selects2a").datum(o_datum);
                                        if (d3.select(this).attr("clicked") === "false") {
                                            let sister_btn_id = "crange_remove";
                                            d3.select("#"+sister_btn_id).attr("clicked", "true");
                                            d3.select("#"+sister_btn_id).dispatch("click");
                                        }
                                    }
                                    d3.select(this).attr("clicked", "false");
                                    drawColorDomain();
                                });
                                color_opts_div.append("div").attr("id", "color_opts_div_domains");
                                function drawColorDomain() {
                                    let color_opts_div2 = d3.select("#color_opts_div_domains");
                                    color_opts_div2.html("");
                                    let domain_datum = d3.select("#modal_selects2a").datum().domain;
                                    for (let ird = 0; ird < domain_datum.length; ird++) {
                                        let range_val = domain_datum[ird];
                                        color_opts_div2.append("input")
                                        .attr("type", "text")
                                        .attr("id", function(){return "coldomain"+ird;})
                                        .datum({"ind":ird})
                                        .attr("value", function(d){
                                            let o_datum = d3.select("#modal_selects2a").datum();
                                            let old_range = o_datum.domain;
                                            return old_range[d.ind];
                                        })
                                        .attr("previous_value", function(d){
                                            let o_datum = d3.select("#modal_selects2a").datum();
                                            let old_range = o_datum.domain;
                                            return old_range[d.ind];
                                        })
                                        .style("border-radius", "6px")
                                        .style("background-color", "#404040")
                                        .style("color", "white")
                                        .attr("size", "5")
                                        .on("change", function(d) {
                                            let tcoval = d3.select("#coldomain"+d.ind).property("value");
                                            let value_is_numeric = that.isNumeric(tcoval);
                                            if (["min", "max"].indexOf(tcoval) > -1 || value_is_numeric) {
                                                if (value_is_numeric === true) {
                                                    tcoval = parseFloat(tcoval);
                                                }
                                                d3.select(this).attr("previous_value", tcoval);
                                                let o_datum = d3.select("#modal_selects2a").datum();
                                                let old_range = o_datum.domain;
                                                old_range[d.ind] = tcoval;
                                                o_datum.domain = old_range;
                                                d3.select("#modal_selects2a").datum(o_datum);
                                            } else {
                                                let previous_value = d3.select(this).attr("previous_value");
                                                d3.select(this).property("value", previous_value+"");
                                            }
                                        });
                                    }

                                }
                                drawColorDomain();
                            }
                        } else {
                            color_opts_div.append("p").html("No Properties Found!");
                        }
                    }
                });
                modal_selects.dispatch("change");

                

                modal_div.append("br")
                modal_div.append("button")
                .html("OK")
                .on("click", function () {
                    if (d3.select("#modal_selects2a").size() > 0) {
                        let current_rule_value = d3.select("#text_build_div_text").property("value");
                        if (current_rule_value) {
                            let header_rule = current_rule_value.split(",")[0];
                            let remaining = current_rule_value.split(",").slice(1);
                            remaining = remaining.join(",");
                            // remaining = d3.select("#color_opts_div").datum().color;
                            let datum_to = d3.select("#modal_selects2a").datum();
                            remaining = ",by:" + datum_to.property + ","+ datum_to.range.join(";") + "," + datum_to.domain.join(";")
                            current_rule_value = header_rule+remaining;
                        } else {
                            current_rule_value = first_value;
                        }
                        d3.select("#text_build_div_text").property("value", current_rule_value);

                    } else  {
                        //color_opts_div
                        let current_rule_value = d3.select("#text_build_div_text").property("value");
                        if (current_rule_value) {
                            let header_rule = current_rule_value.split(",")[0];
                            let remaining = current_rule_value.split(",").slice(1);
                            remaining = remaining.join(",");
                            remaining = ","+ d3.select("#color_opts_div").datum().color;
                            current_rule_value = header_rule+remaining;
                        } else {
                            current_rule_value = first_value;
                        }
                        d3.select("#text_build_div_text").property("value", current_rule_value);
                    }
                    d3.select("#modal_s").remove();
                });
            });

            s_div.append("input")
            .attr("type", "button")
            .style("border-radius", "6px")
            .style("color", "white")
            .style("background-color", "#404040")
            .style("font-size", "15px")
            .style("display", "inline")
            .attr("value", "Clear Rule")
            .on("click", function() {
                d3.select("#text_build_div_text").property("value", "");
            });

            s_div.append("input")
            .attr("type", "button")
            .style("border-radius", "6px")
            .style("color", "white")
            .style("background-color", "#404040")
            .style("font-size", "15px")
            .style("display", "inline")
            .attr("value", "Draw Rule")
            .on("click", function() {
                let color_rules = that.deepCopy(that.naview_obj.getColorRules());
                let new_rules_i_got_it = d3.select("#text_build_div_text").property("value");
                color_rules.push(new_rules_i_got_it);
                that.naview_obj.setColorRulesAndReRender(color_rules);
                d3.select("#text_build_div_text").property("value", "");
            });

            s_div.append("input")
            .attr("type", "button")
            .style("border-radius", "6px")
            .style("color", "white")
            .style("background-color", "#404040")
            .style("font-size", "15px")
            .style("display", "inline")
            .attr("value", "Reset Rules")
            .on("click", function() {
                that.naview_obj.setColorRulesAndReRender([]);
            });

            
        }
        div_selection.append("br");

    }

    uploadProperties(lineString) {
        let arrayOfLines = lineString.match(/[^\r\n]+/g);
        let header_line = arrayOfLines[0];
        let header_line_columns = header_line.split(",");
        if (header_line_columns.length < 1) {
            throw "Wrong Properties Header Format: No data";
        }
        if (header_line_columns.length < 2) {
            throw "Wrong Properties Header Format: Only one column";
        }
        if (header_line_columns[0] !== "Resid") {
            throw "Wrong Properties Header Format: Missing Resid in Column 1";
        }
        arrayOfLines = arrayOfLines.slice(1, arrayOfLines.length);
        let new_properties_obj = {};
        for (let i_line = 0; i_line < arrayOfLines.length; i_line++) {
            let line = arrayOfLines[i_line];
            let columns = line.split(",");
            let resid = columns[0];
            if (this.isNumericInt(resid) === false) {
                throw "Wrong Resid Column Format: Only Integers allowed";
            }
            resid = parseInt(resid);
            new_properties_obj[resid] = {};
            for (let i_col = 1; i_col < columns.length; i_col++) {
                let property_name = header_line_columns[i_col];
                let property_value = columns[i_col];
                if (this.isNumeric(property_value) === false) {
                    throw "Wrong Properties at Line:"+(i_line+1)+" Column: "+(i_col+1)+" Format: Only Numeric values allowed";
                }
                new_properties_obj[resid][property_name] = parseFloat(property_value);
            }
        }
        console.log("new_properties_obj");
        console.log(new_properties_obj);
        this.naview_obj.setStyleObj(this.style_obj_copy);
        this.naview_obj.setCurrentPropertiesResetView(new_properties_obj);
    }

    uploadRelations(lineString) {
        let arrayOfLines = lineString.match(/[^\r\n]+/g);
        let header_line = arrayOfLines[0];
        let header_line_columns = header_line.split(",");
        if (header_line_columns.length < 1) {
            throw "Wrong Properties Header Format: No data";
        }
        if (header_line_columns.length < 2) {
            throw "Wrong Properties Header Format: Only one column";
        }
        if (header_line_columns[0] !== "source") {
            throw "Wrong Properties Header Format: Missing source in Column 1";
        }
        if (header_line_columns[1] !== "target") {
            throw "Wrong Properties Header Format: Missing target in Column 2";
        }
        if (header_line_columns[2] !== "raw_weight") {
            throw "Wrong Properties Header Format: Missing raw_weight in Column 3";
        }
        if (header_line_columns[3] !== "type") {
            throw "Wrong Properties Header Format: Missing type in Column 4";
        }
        arrayOfLines = arrayOfLines.slice(1, arrayOfLines.length);
        let new_properties_obj = [];
        for (let i_line = 0; i_line < arrayOfLines.length; i_line++) {
            let line = arrayOfLines[i_line];
            let columns = line.split(",");
            if (this.isNumeric(columns[2]) === false) {
                throw "Wrong Resid raw_weight Column Format: Only Numbers allowed";
            }
            let col1 = columns[0];
            if (this.isNumericInt(col1)) {
                col1 = parseInt(col1);
            }
            let col2 = columns[1];
            if (this.isNumericInt(col2)) {
                col2 = parseInt(col2);
            }
            let properties_obj = {
                "source":col1,
                "target":col2,
                "raw_weight":parseFloat(columns[2]),
                "type":columns[3],
            };
            new_properties_obj.push(properties_obj);
        }
        this.naview_obj.setStyleObj(this.style_obj_copy);
        this.naview_obj.setCurrentRelationsResetView(new_properties_obj);
    }

}