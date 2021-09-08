//TODO: write up mock tests

/**
 * This is the main function
 * @module NaView
 * @namespace
 * @param {string} svg_id id of selected/created svg
 * @param {string} container_id id of selected/created svg container
 * @param {number} svg_width width of selected/created svg (default:1200px)
 * @param {number} svg_height height of selected/created svg (default:500px)
 * @param {Object} style_obj_input styling object for all drawing options. See <b><i>style_obj</i></b> in Docs
 * @param {string} protein_input UniProt raw text to be processed See <b><i>parsed_protein_data</i></b> and also <b><i>processRawUniProt</i></b> in Docs
 * @also
 * @param {Object} protein_input processed data input See <b><i>parsed_protein_data</i></b> and also <b><i>processRawUniProt</i></b> in Docs
 * @param {Object} properties residue properties for color mapping and Text drawing by residue selection. See <b><i>current_resid_properties</i></b> in Docs
 * @param {Array} color_rules Array of strings containing color rules in the color selection syntax. See <b><i>fillRules</i></b> and also <b><i>createFillRules</i></b> in Docs
 * @param {Array} text_to_draw Array of strings containing text drawing rules in the text selection syntax. See <b><i>draw_symbols</i></b> in Docs
 * @param {Array} relationships Array of Objects describing residue relationships to be drawn in plot See <b><i>draw_residue_relations</i></b> in Docs
 */
function NaView({
    svg_id="naview_svg",
    container_id="naview_container",
    svg_width=1200,
    svg_height=500,
    //TODO: validate functions for all inputs
    style_obj_input,
    protein_input,
    //TODO: convert properties function 
    properties={},
    color_rules=[],
    text_to_draw=[],
    relationships=[],
    }={}) {

    /**
     * Function to generate the default style object.<br>
     * 1. Helices are shown as cartoon<br>
     * 2. Membrane is shown as lipid bilayer<br>
     * 3. All loops have fixed lengths<br>
     * @yields default style object
     * @exports NaView
     * @name generateDefaultStyleObject
     * @namespace
     */
    function generateDefaultStyleObject() {
        let defaultStyleObject = {
            "membrane": {
                "membrane_mode": "lipid",
                "membrane_draw_opts": {
                    "hfill": "white",
                    "hstroke": "black",
                    "hstroke_s": 2, //px
                    "hopacity": 0.6,
                    "tfill": "black",
                    "tstroke": "black",
                    "tstroke_s": 2, //px
                    "topacity": 0.6,
                    "lipid_head_radius_width": 0.0075, //% of viewbox width
                    "lipid_head_radius_height": 0.1, //% of viewbox height
                    "lipid_tail_number": 2,
                    "lipid_tail_breaks": 1,
                    "lipid_tail_spacing": 0.001, //% of viewbox height
                },
                "membrane_region_height": 0.4, //% of viewbox
            },
            "protein": {
                "helix_mode": "cartoon",
                "helix_draw_opts": {
                    "draw": { //example cartoon
                        "x_to_end_prop": 1/20,
                        "y_to_mid_prop": 1/7,
                        "aa_area_perc_displacement": 0.1,
                        "thickness": 0.55,
                        "front_helix_stroke":'black',
                        "back_helix_stroke": 'black',
                        "stroke_size": 1.5, //px
                    },
                    "type": "dicts",
                    "fill": {
                        "type":"domain_and_name",
                        "I": { 1:"red",2:"red",3:"red",4:"blue",5:"red",6:"red"},
                        "II": { 1:"red",2:"red",3:"red",4:"blue",5:"red",6:"red"},
                        "III": { 1:"red",2:"red",3:"red",4:"blue",5:"red",6:"red"},
                        "IV": { 1:"red",2:"red",3:"red",4:"blue",5:"red",6:"red"},
                    },
                    "back_fill": {
                        "type":"domain_and_name",
                        "I": { 1:"salmon",2:"salmon",3:"salmon",4:"lightblue",5:"salmon",6:"salmon"},
                        "II": { 1:"salmon",2:"salmon",3:"salmon",4:"lightblue",5:"salmon",6:"salmon"},
                        "III": { 1:"salmon",2:"salmon",3:"salmon",4:"lightblue",5:"salmon",6:"salmon"},
                        "IV": { 1:"salmon",2:"salmon",3:"salmon",4:"lightblue",5:"salmon",6:"salmon"},
                    },
                    "stroke": {
                        "type":"domain_and_name",
                        "I": { 1:"red",2:"red",3:"red",4:"blue",5:"red",6:"red"},
                        "II": { 1:"red",2:"red",3:"red",4:"blue",5:"red",6:"red"},
                        "III": { 1:"red",2:"red",3:"red",4:"blue",5:"red",6:"red"},
                        "IV": { 1:"red",2:"red",3:"red",4:"blue",5:"red",6:"red"},
                    },
                    "stroke_size": {
                        "type":"domain_and_name",
                        "I": { 1:2, 2:2, 3:2, 4:3, 5:2, 6:2},
                        "II": { 1:2, 2:2, 3:2, 4:3, 5:2, 6:2},
                        "III": { 1:2, 2:2, 3:2, 4:3, 5:2, 6:2},
                        "IV": { 1:2, 2:2, 3:2, 4:3, 5:2, 6:2},
                    },
                    "opacity": {
                        "type":"domain_and_name",
                        "I": { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1},
                        "II": { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1},
                        "III": { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1},
                        "IV": { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1},
                    },
                },
                "helix_region_width" : {
                    "type": "domain_and_name", //pre defined widths
                    "I": [0.02,0.02,0.02,0.02,0.02,0.02], //% of viewbox, example cartoon
                    "II": [0.02,0.02,0.02,0.02,0.02,0.02], //% of viewbox
                    "III": [0.02,0.02,0.02,0.02,0.02,0.02], //% of viewbox
                    "IV": [0.02,0.02,0.02,0.02,0.02,0.02], //% of viewbox
                },
                "helix_region_height" : {
                    "I": [0.4,0.4,0.4,0.4,0.4,0.4], //% of viewbox
                    "II": [0.4,0.4,0.4,0.4,0.4,0.4], //% of viewbox
                    "III": [0.4,0.4,0.4,0.4,0.4,0.4], //% of viewbox
                    "IV": [0.4,0.4,0.4,0.4,0.4,0.4], //% of viewbox
                },
                "helix_spacing_width" : {
                    "I": [5,5,5,5,5,5], // px
                    "II": [5,5,5,5,5,5], // px
                    "III": [5,5,5,5,5,5], // px
                    "IV": [5,5,5,5,5,5], // px
                },
                "short_loops_draw_opts": {
                    "type": "single",
                    "stroke": "black",
                    "fill": "none",
                    "opacity": 1,
                    "stroke_size": "3px",
                    "calc_len": {
                        "type": "reslen", // fixed, custom, scaled, reslen
                        "calc": {
                            "length": 2 //in pixels
                        },
                    },
                    "shape": {
                        "type": "simple", // simple, bulb, mushroom, mushroom_skew
                        "calc": {
                            "y_step": 0.5, //step used in path searching option in px, ignored in fixed, custom
                        },
                    }
                },
                "pore_loops_draw_opts": {
                    "type": "single",
                    "stroke": "black",
                    "fill": "none",
                    "opacity": 1,
                    // "stroke_size": "1.5px",
                    "stroke_size": "3px",
                    "calc_len": {
                        "type": "reslen", // fixed, scaled, reslen
                        "calc": {
                            "length": 2 //in pixels
                        },
                    },
                    "shape": {
                        "type": "simple_skewed", // simple_skewed only
                        "calc": {
                            "perc_center_x": 0, //% of each distance from x1 to center. modifies curve shape, ignored if break_type is not none 
                            "y_step": 0.5, //step used in path searching option in px, ignored in fixed, custom
                        }
                    }
                },
                "pore_region_width" : {
                    "I":0.01, //% of viewbox
                    "II":0.01, //% of viewbox
                    "III":0.01, //% of viewbox
                    "IV":0.01, //% of viewbox
                },
                "pore_region_height": {
                    "I":0.4, //% of viewbox
                    "II":0.4, //% of viewbox
                    "III":0.4, //% of viewbox
                    "IV":0.4, //% of viewbox
                },
                "long_loops_draw_opts": {
                    "type": "single",
                    "stroke": "black",
                    "fill": "none",
                    "opacity": 1,
                    "stroke_size": "3px",
                    "width": {
                        "type": "scaled", // fixed, custom, scaled
                    },
                    "calc_len": {
                        "type": "reslen", // fixed, custom, scaled, reslen
                        "calc": {
                            "length": 2 //in pixels
                        },
                    },
                    "shape": {
                        "type": "mushroom", // simple, bulb, mushroom, mushroom_skew
                        "calc": {
                            "x_step":0.5, //step used in path searching option in px, ignored in fixed, custom
                            "y_step":1,
                            "perc_center_x": 0.9, //% of each distance from x1 to center. modifies mushroom shape
                            "perc_step_y1":0.1 , //% of each y step for p1 and p5 of path. modifies mushroom shape
                            "perc_step_y2": 0.5, //% of each y step for p2 and p4 of path. modifies mushroom shape
                        }
                    }
                },
                "nter_loop_width": 0.05, //% of viewbox
                "nter_loop_draw_opts": {
                    "type": "single",
                    "stroke": "black",
                    "fill": "none",
                    "opacity": 1,
                    "stroke_size": "3px",
                    "calc_len": {
                        "type": "reslen", // fixed, reslen
                        "calc": {
                            "length": 2, //in pixels
                            "start_loop": "edge",
                        },
                    },
                    "shape": {
                        "type": "n_curves", // n_curves
                        "calc": {
                            "y_step": 0.5, //step used in path searching option in px, ignored in fixed, custom
                            "n_centers": 2, //number of waves to draw in curve
                            "perc_centers_height":[1.0, 0.5],// height percentage of each wave
                            "loop_rotation": 30 //rotation of loop around starting point
                        }
                    }
                },
                "cter_loop_width": 0.05, //% of viewbox
                "cter_loop_draw_opts": {
                    "type": "single",
                    "stroke": "black",
                    "fill": "none",
                    "opacity": 1,
                    "stroke_size": "3px",
                    "calc_len": {
                        "type": "fixed", // fixed, reslen
                        "calc":{
                            "height": 0.4, //% of membrane to end height
                            "start_loop": "edge",
                        },
                    },
                    "shape": {
                        "type": "n_curves", // n_curves
                        "calc": {
                            "y_step": 0.5, //step used in path searching option in px, ignored in fixed, custom
                            "n_centers": 4, //number of waves to draw in curve
                            "perc_centers_height":[1.0, 0.8, 0.5, 0.4],// height percentage of each wave
                            "loop_rotation": -30 //rotation of loop around starting point
                        }
                    }
                },
                "residue_centroid_draw_opts": {
                    "type": "single",
                    "stroke": "black",
                    "fill": "red",
                    "opacity": 1,
                    "stroke_size": "0px",
                    "circle_radius": "1.5px",
                },
                "residue_relations_draw_opts" : {
                    "type": "single",
                    "opacity": 1,
                    "stroke_size": "1.5px",
                    "centroid_pos": {
                        "type": "custom",
                        "perc_dict": {
                            "intramembrane":{
                                "intramembrane":{"perc_y":"between", "perc_x":"between"},
                                "intracellular":{"perc_y":0.65, "perc_x":"between"},
                                "extracellular":{"perc_y":0.35, "perc_x":"between"},
                            },
                            "intracellular":{
                                "intracellular":{"perc_y":"between", "perc_x":"between"},
                                "intramembrane":{"perc_y":0.65, "perc_x":"between"},
                                "extracellular":{"perc_y":0.85, "perc_x":0.95}
                            },
                            "extracellular":{
                                "extracellular":{"perc_y":"between", "perc_x":"between"},
                                "intracellular":{"perc_y":0.15, "perc_x":0.05},
                                "intramembrane":{"perc_y":0.35, "perc_x":"between"}
                            },
                        }
                    },
                    "weight_scaling": "absolute",
                    "path_width_scaling": {
                        "type":"calc",
                        "domain": ["min", "max"],
                        "range": [2, 5],
                        "group_by_type": true
                    },
                    "color_scaling": {
                        "type":"calc",
                        "property": "weight",
                        "domain": ["min", "max"],
                        "range": ["green", "blue"],
                        "lighter_fill": true
                    },
                    "element_centroid_scaling": {
                        "type":"fixed",
                        "radius": 5,
                    },
                    "stroke": "green",
                    "fill": "lightgreen",
                },
            },
            "canvas" : {
                "border" : {
                    "right": 0.02, //% of viewbox
                    "left":0.02, //% of viewbox
                    "top": 0.02, //% of viewbox
                    "bottom": 0.02, //% of viewbox
                }
            },
            "text_defs": {
                "font_family": "sans-serif",
                "font_style": "italic",
                "font_size": "30px",
                "fill": "black",
                "center_xy": true,
            }
        }
        return defaultStyleObject;
    }

    /**
     * Object which controls every drawing aspect of plot. Contains four main attributes with lots of possible subdivisions and options.<br>
     * These four attributes are:<br>
     * <br>
     * 1. "membrane"<br>
     * 2. "canvas"<br>
     * 3. "textdefs"<br>
     * 4. "protein"<br>
     * <br>
     * "membrane":<br>
     * <br>
     * ----Sub-attributes: "membrane_region_height", "membrane_mode", "membrane_draw_opts"<br>
     * ----"membrane_region_height": controls % of total svg height occupied by membrane
     * ----"membrane_draw_opts" sub-attributes depends on the "membrane_mode".<br>
     * <br>
     * ----"membrane_mode" has two possible values:<br>
     * <br>
     * -----> "box" for drawing membranes as a colored rectangle<br>
     * -----> "lipid" for drawing membranes as a lipid bilayer<br>
     * <br>
     * --------"membrane_draw_opts" used sub-attributes for "membrane_mode":"box" are:<br>
     * --------"fill": membrane rectangle color<br>
     * --------"opacity": membrane rectangle opacity<br>
     * <br>
     * --------"membrane_draw_opts" used sub-attributes for "membrane_mode":"lipid" are:<br>
     * --------"hfill": membrane lipid head group color<br>
     * --------"hstroke": membrane lipid head group stroke color<br>
     * --------"hstroke_s": membrane lipid head group stroke width in pixels<br>
     * --------"hopacity": membrane lipid head group opacity<br>
     * --------"tfill": membrane lipid tail group color<br>
     * --------"tstroke": membrane lipid tail group stroke color<br>
     * --------"tstroke_s": membrane lipid tail group stroke width in pixels<br>
     * --------"topacity": membrane lipid tail group opacity<br>
     * --------"lipid_head_radius_width": lipid head group width in % of total svg width<br>
     * --------"lipid_head_radius_height": lipid head group height in % of total svg height<br>
     * --------"lipid_tail_number": number of lipid tails per lipid group<br>
     * --------"lipid_tail_breaks": lipid tail breaks per lipid group (currently not used)<br>
     * --------"lipid_tail_spacing": lipid upper membrane to lower membrane tails spacing in % of total svg height<br>
     * <br>
     * "canvas":<br>
     * <br>
     * ----Sub-attribute: "border" with sub-attributes "right", "left", "top", "bottom"<br>
     * ----"right": controls svg right border in % of total svg width<br>
     * ----"left": controls svg left border in % of total svg width<br>
     * ----"top": controls svg top border in % of total svg height<br>
     * ----"bottom": controls svg bottom border in % of total svg height<br>
     * <br>
     * "textdefs":<br>
     * ----Sub-attributes: "font_family", "font_style", "font_size", "fill", "center_xy"<br>
     * ----"font_family: controls text default font family<br>
     * ----"font_style": controls text default font style<br>
     * ----"font_size": controls text default font size<br>
     * ----"fill": controls text default color<br>
     * ----"center_xy": controls text automatic centering around "absolute" coordinate<br>
     * <br>
     * "protein":<br>
     * <br>
     * ----Has many sub-attributes related to the drawing of different elements<br>
     * ----Sub-attributes for helices under protein: "helix_mode", "helix_draw_opts", "helix_region_width", "helix_region_height", "helix_spacing_width"<br>
     * <br>
     * ----"helix_mode": determines type of helix to be drawn: "box", "cylinder" or "cartoon" are possible values.<br>
     * ----"helix_draw_opts": determines helix drawing characteristics according to helix type.<br>
     * --------"helix_draw_opts" used sub-attributes for "helix_mode":"box" are: NONE<br>
     * --------"helix_draw_opts" used sub-attributes for "helix_mode":"cylinder" are:<br>
     * --------"top_cylinder_stroke": stroke color of top cylinder circle<br>
     * --------"top_cylinder_stroke_size": stroke size of top cylinder circle<br>
     * --------"bottom_cylinder_stroke": stroke size of bottom cylinder cirle<br>
     * --------"bottom_cylinder_stroke_size": stroke color of bottom cylinder circle<br>
     * <br>
     * --------"helix_draw_opts" used sub-attributes for "helix_mode":"cartoon" are:<br>
     * --------"x_to_end_prop": proportion that influences shape of drawn half helices<br>
     * --------"y_to_mid_prop": proportion that influences shape of drawn half helices<br>
     * --------"aa_area_perc_displacement": proportion that influences shape of drawn half helices<br>
     * --------"thickness": proportion that influences half turn height<br>
     * --------"front_helix_stroke": stroke color of front half helices<br>
     * --------"back_helix_stroke": stroke color of back half helices<br>
     * --------"stroke_size": stroke size of half helices<br>
     * <br>
     * ----"helix_draw_opts" also has properties that can be applied for any helix element which<br>
     * ----have a specific formatting as a dictionary of domain keys mapping to arrays of six elements<br>
     * ----corresponding to each helix(H1-H6) of each domain (I-IV)<br>
     * --------"fill": color of front turns for each helix of each domain<br>
     * --------"back_fill": color of back turns for each helix of each domain<br>
     * --------"stroke": color of stroke for each helix of each domain<br>
     * --------"stroke_size": size in pixels of stroke for each helix of each domain<br>
     * --------"opacity": opacity of each helix in each domain<br>
     * --------example: "I": { 1:"red",2:"red",3:"red",4:"blue",5:"red",6:"red"} for colors<br>
     * <br>
     * ----The helix related attributes: "helix_region_width", "helix_region_height", "helix_spacing_width",<br>
     * ----have a specific formatting as a dictionary of domain keys mapping to arrays of six elements<br>
     * ----corresponding to each helix(H1-H6) of each domain (I-IV)<br>
     * ----"helix_region_width": controls helix plot width in % of total svg width<br>
     * ----"helix_region_height": controls helix plot height in % of total svg height<br>
     * ----"helix_spacing_width": controls spacing between helices in % of total svg width<br>
     * <br>
     * ----Sub-attributes for loops include different loops categories such as:<br><br>
     * ----"short_loops_draw_opts" for short, intra domain loops<br>
     * ----"long_loops_draw_opts" for long, between domain loops<br>
     * ----"pore_loops_draw_opts", "pore_region_width", "pore_region_height" for pore loops<br>
     * ---- "nter_loop_width", "nter_loop_draw_opts" for the N-terminal loop<br>
     * ---- "cter_loop_width", "cter_loop_draw_opts" for the C-terminal loop<br>
     * ---- the sub-attributes of the differnt loops "_draw_opts" objects are mostly equal:<br>
     * --------"type": value is "single". has no importance for now but is essential<br>
     * --------"stroke": color of loop path stroke<br>
     * --------"fill": color of loop path ("none" should be used for non-polygon paths)<br>
     * --------"opacity": opacity of loop path<br>
     * --------"stroke_size": stroke width of loop path<br>
     * <br>
     * --------"calc_len": describes how loop length should be calculated. has multiple options of additional attributes<br>
     * ------------"type": indicates loop length calculus type. "fixed", "scaled", "reslen" and "custom" are possible options<br>
     * ------------"calc": contains additional attributes for each loop length calculus "type"<br>
     * <br>
     * ------------ "fixed" indicates an equal, similar loop drawn for fixed box with a given height, width (when applicable for loop shape)<br>
     * ------------ "fixed" has required attributes inside "calc": "height" "width" indicating % of total svg width, height<br>
     * <br>
     * ------------ "scaled" indicates each loop should be drawn from boxes with height, widths proportional to their amino acid numbering<br>
     * ------------ "scaled" has required attributes inside "calc": "height" "width" indicating maximum % of total svg width, height for biggest loop<br>
     * ------------ "scale" which indicates type of aa number loop scaling: "linear", "power" or "log". <br>
     * ------------ logarithimic "log" scale can have its base set by a "base" additional attribute inside "calc"<br>
     * ------------ power "power" scale can have its exponent set by a "exponent" additional attribute inside "calc"<br>
     * ------------ "scale" types are unavailable for "nter_loop_draw_opts" and "cter_loop_draw_opts"<br>
     * <br>
     * ------------ "reslen" indicates each loops aminoacid should have a given length in pixels<br>
     * ------------ "reslen" requires "length" attribute inside "calc" indicating aminoacid length in pixels.<br>
     * ------------ please note that loop minimum width is automatically set when bigger than "length" attribute<br>
     * ------------ this is calculates by a straight line between helices anchoring points divided by the loop aa number<br>
     * <br>
     * ------------ "custom" indicates an specific loop length for each loop defined by a dictionary indicating loop position<br>
     * ------------ "custom" requires dictionaries for "width" and "height" inside "calc" options.<br>
     * ------------ for "short_loops_draw_opts" this dictionary is formatted as the example below:<br>
     * ------------ "I": [0.01,0.01,0.01,0.01,0.005,0.01,0.01]<br>
     * ------------ for "long_loops_draw_opts" this dictionary is formatted as the example below:<br>
     * ------------ {2: 0.01, 3: 0.01, 4: 0.01},<br>
     * ------------ for "pore_loops_draw_opts", "nter_loop_draw_opts" and "cter_loop_draw_opts", the "custom" option is not available<br>
     * <br>
     * --------"shape": describes how loop shape should be drawn<br>
     * ------------"type": indicates how loop shape should be drawn in plot<br>
     * ------------"calc": contains additional attributes for drawing specific loop shapes<br>
     * <br>
     * ------------ loop types "simple", "bulb" and "mushroom" are available for <b><i>both short and long loops</b></i><br>
     * ------------ in loop type "simple", loop points are defined by the two helices anchoring points plus<br>
     * ------------ their centroid point, which is scaled in the vertical direction according to "calc_len"<br>
     * ------------ "height" definitions and to a "y_step" calc attribute <br>
     * ------------ an optional "calc" attribute "perc_center_x" can regulate the x positioning of the centroid<br>
     * ------------ point in relation to the anchoring first and second points.<br>
     * <br>
     * ------------ in loop type "bulb", besides the above points for loop "simple", two additional points are added:<br>
     * ------------ one before the first anchoring point and another after the first anchoring point<br>
     * ------------ the y position of these points are defined as a percentage of the scaled centroid point height<br>
     * ------------ by the "perc_step_y" attribute. their x positions are defined by the "calc_len"<br>
     * ------------ "width" definitions and to a "x_step" calc attribute <br>
     * <br>
     * ------------ in loop type "mushroom", besides the above points for loop "bulb", two additional points are added:<br>
     * ------------ one between the first anchoring point and the centroid point<br>
     * ------------ and another between the centroid point and the second anchoring point<br>
     * ------------ the y position of these points are defined as a percentage of the scaled centroid point height<br>
     * ------------ by the "perc_step_y2" attribute. ("perc_step_y1" is used for the "bulb" additional points)<br>
     * ------------ their x positions are defined by the "perc_center_x" "calc" attribute which regulates their distance<br>
     * ------------ between the anchoring points and the centroid as a frequency (0.0-1.0)<br>
     * <br>
     * ------------ loop type "swirl" is available only for both <b><i>short loops</b></i><br>
     * ------------ this is mostly equal to the simple loop but here a "swirl_x" calc attribute is<br>
     * ------------ used to calculate the x positioning of two new points relative to the anchoring points centroid<br>
     * ------------ these two points are added between the first and centroid and centroid and second points<br>
     * ------------ their y positioning is controled by a "perc_step_y" attribute. the x positioning delta of the<br>
     * ------------ two new points is also added to the centroid point<br>
     * <br>
     * ------------ loop type "simple_skewed" is the only available <b><i>only for pore loops</b></i><br>
     * ------------ this is equal to the "simple" loop definition but with the obligatory attribute<br>
     * ------------ "perc_center_x" for controlling the x positioning of the centroid point<br>
     * <br>
     * ------------ loop type "n_curves" is the only available <b><i>only for N and C terminal loops</b></i><br>
     * ------------ in loop type "n_curves", loops are initially drawn as a straight line <br>
     * ------------ from the "canvas" bottom left corner to Helix 1 of Domain 1 and a number of "waves" are added<br>
     * ------------ to these loops. the height of each wave is calculated as percentages of a maximum wave step (attribute "y_step")<br>
     * ------------ in the calc attribute "perc_centers_height". the number of waves is defined in the "n_centers" "calc" attribute<br>
     * <br>
     * --------- Note 1:<br>
     * --------- long_loops_draw_opts has an additional "width" attribute that regulates their initial draw areas "width" calculation<br>
     * --------- this is done by it's subattribute "type" whose possible values are "fixed" (equal inter domain loops width)<br>
     * --------- or "scaled" (inter domain loops width proportional to loop aa number)<br>
     * <br>
     * ---- Note 2:<br>
     * ---- pore loops have two attributes under "protein": <br>
     * ---- "pore_region_width" and "pore_region_height" for controlling their draw areas width and height<br>
     * ---- as percentages of the svg total width and height. the values of these attributes are dictionaries<br>
     * ---- containing keys for the pore loops of each domain as the example below:<br>
     * ---- {"I":0.01,"II":0.01,"III":0.01,"IV":0.01}<br>
     * <br>
     * ---- Note 3:<br>
     * ---- N ter and C ter loops have each a single attribute under "protein": <br>
     * ---- "nter_loop_width" and "cter_loop_width" controlling their draw areas respective width<br>
     * ---- as percentages of the svg total width.<br>
     * @namespace
     * @type {{}}
     * @exports NaView
     * @name style_obj
     */
    var style_obj;

    /**
     * Dictionary for residue properties.<br>
     * Properties are defined as: residue_index:{"property":property_value}<br>
     * Example: {<br>
     *     1: {//residue 1 of protein sequence<br>
     *         "Conservation": 0.1 //Value of Conservation Property<br>
     *     },<br>
     *     2: {//residue 2 of protein sequence<br>
     *         "Conservation": 0.3 //Value of Conservation Property<br>
     *     },<br>
     *     3: {//residue 3 of protein sequence<br>
     *         "Conservation": 0.6 //Value of Conservation Property<br>
     *     },<br>
     *     4: {//residue 4 of protein sequence<br>
     *         "Conservation": 0.7 //Value of Conservation Property<br>
     *     },<br>
     *     ...<br>
     *     2005: {//residue 2005 of protein sequence<br>
     *         "Conservation": 0.9 //Value of Conservation Property<br>
     *     }<br>
     * }<br>
     * @namespace
     * @type {{}}
     * @exports NaView
     * @name current_resid_properties
     */
    var current_resid_properties;

    /**
     * Global object storing fill rules for residue/elements
     * @see createFillRules
     * @namespace
     * @type {{}}
     * @exports NaView
     * @name fillRules
     */
    var fillRules = [];

    /**
     * Global object storing drawing area boundaries for SVG element
     * @namespace
     * @type {{}}
     * @exports NaView
     * @name svg_drawarea
     */
    var svg_drawarea;

    /**
     * Dictionary for converting one letter amino acid syntax to three letter
     * @namespace
     * @type {{}}
     * @exports NaView
     * @name one_to_three
     */
    var one_to_three = {
        "A":"ALA",
        "C":"CYS",
        "D":"ASP",
        "E":"GLU",
        "F":"PHE",
        "G":"GLY",
        "H":"HIS",
        "I":"ILE",
        "K":"LYS",
        "L":"LEU",
        "M":"MET",
        "N":"ASN",
        "P":"PRO",
        "Q":"GLN",
        "R":"ARG",
        "S":"SER",
        "T":"THR",
        "V":"VAL",
        "W":"TRP",
        "Y":"TYR",
    };
    
    /**
     * Dictionary for converting three letter amino acid syntax to one letter
     * @namespace
     * @type {{}}
     * @exports NaView
     * @name three_to_one
     */
    var three_to_one = {
        "ALA":"A",
        "CYS":"C",
        "ASP":"D",
        "GLU":"E",
        "PHE":"F",
        "GLY":"G",
        "HIS":"H",
        "ILE":"I",
        "LYS":"K",
        "LEU":"L",
        "MET":"M",
        "ASN":"N",
        "PRO":"P",
        "GLN":"Q",
        "ARG":"R",
        "SER":"S",
        "THR":"T",
        "VAL":"V",
        "TRP":"W",
        "TYR":"Y",
    };
    
    /**
     * List of allowed names for drawn elements.<br>
     * Allowed elements are named according to:<br><br>
     * 1. their Domain (I,II,III,IV) or InterDomain (1,2,3,4,5) references<br>
     * 2. A semicolon (;) Domain to Element separator.<br>
     * 3. their element types (Helix, Pore, Loop) references<br>
     * 4. (Optional) for intradomain Helices and Loops, their element type indexes (1,2,3,4,5,6)<br>
     * @namespace
     * @type {Array}
     * @exports NaView
     * @name allowed_element_names
     */
    var allowed_element_names = [
        "DomainI;Helix1",
        "DomainI;Helix2",
        "DomainI;Helix3",
        "DomainI;Helix4",
        "DomainI;Helix5",
        "DomainI;Helix6",
        "DomainII;Helix1",
        "DomainII;Helix2",
        "DomainII;Helix3",
        "DomainII;Helix4",
        "DomainII;Helix5",
        "DomainII;Helix6",
        "DomainIII;Helix1",
        "DomainIII;Helix2",
        "DomainIII;Helix3",
        "DomainIII;Helix4",
        "DomainIII;Helix5",
        "DomainIII;Helix6",
        "DomainIV;Helix1",
        "DomainIV;Helix2",
        "DomainIV;Helix3",
        "DomainIV;Helix4",
        "DomainIV;Helix5",
        "DomainIV;Helix6",
        "DomainI;Loop1",
        "DomainI;Loop2",
        "DomainI;Loop3",
        "DomainI;Loop4",
        "DomainI;Loop5",
        "DomainI;Loop6",
        "DomainII;Loop1",
        "DomainII;Loop2",
        "DomainII;Loop3",
        "DomainII;Loop4",
        "DomainII;Loop5",
        "DomainII;Loop6",
        "DomainIII;Loop1",
        "DomainIII;Loop2",
        "DomainIII;Loop3",
        "DomainIII;Loop4",
        "DomainIII;Loop5",
        "DomainIII;Loop6",
        "DomainIV;Loop1",
        "DomainIV;Loop2",
        "DomainIV;Loop3",
        "DomainIV;Loop4",
        "DomainIV;Loop5",
        "DomainIV;Loop6",
        "DomainI;Pore",
        "DomainII;Pore",
        "DomainIII;Pore",
        "DomainIV;Pore",
        "InterDomain1;Loop",
        "InterDomain2;Loop",
        "InterDomain3;Loop",
        "InterDomain4;Loop",
        "InterDomain5;Loop"
    ];



    /**
     * Main function for running library. Uses detected parameters to automatically create NaV plot.
     * @exports NaView
     * @name initLib
     * @namespace
     */
    function initLib() {
        initMainSvg(svg_id, container_id, svg_width, svg_height);
        if (style_obj_input) {
            style_obj = style_obj_input;
        }
        if (!style_obj) {
            console.warn('style obj not set. creating a new one...');
            style_obj = generateDefaultStyleObject();
        }
        if (protein_input) {
            initData();
        } else {
            throw "Error: no protein input data";
        }
        initViz();

    }
    initLib();

    /**
     * Function to generate the SVG Dom element.<br>
     * 1. Detects if current svg container exists, and should be created if not<br>
     * 2. Detects if current svg exists and creates it if not<br>
     * 3. Sets svg width and height<br>
     * @param {string} svg_id id of svg to edit/create
     * @param {string} container_id  id of svg to select/create
     * @param {number} svg_width width to set svg
     * @param {number} svg_height height to set svg
     * @exports NaView
     * @name initMainSvg
     * @namespace
     */
    function initMainSvg(svg_id, container_id, svg_width, svg_height) {
        let select_svg_container;
        if (container_id){
            select_svg_container = d3.select("#"+container_id);
            if (select_svg_container.size() === 0) {
                select_svg_container = d3.select("body").append("div").attr("id", container_id);
            }
        } else {
            select_svg_container = d3.select("body");
        }
        let select_svg = d3.select("#"+svg_id);
        if (select_svg.size() === 0) {
            select_svg = select_svg_container.append("svg").attr("id", svg_id);
        }
        select_svg
            .attr("width", svg_width)
            .attr("height", svg_height);
    }

    /**
     * Function to verify and parse the user protein data.
     * @exports NaView
     * @name initData
     * @namespace
     */
    function initData() {
        //check if input is already processed or not
        let processed = true;
        let key_list = ["fullseq","data","count_data","resid_properties"];
        for (let ikl = 0; ikl < key_list.length; ikl++) {
            let e_key = key_list[ikl];
            if (protein_input.hasOwnProperty(e_key) === false) {
                // throw "Error: input data is missing required data keys"; 
                console.warn("input data is missing required data keys... trying to parse raw data"); 
                processed = false;
                break;
            }
        }
        if (!processed) {
            parsed_protein_data = processRawUniProt(protein_input);
        } else {
            parsed_protein_data = protein_input;
        }
    }

    /**
     * Function to generate the Membrane Plot.<br>
     * @exports NaView
     * @name initViz
     * @namespace
     */
    function initViz() {
        let parsed_protein_data_drawareas = define_draw_areas(parsed_protein_data.data);
        parsed_protein_data.data = parsed_protein_data_drawareas[0];
        parsed_protein_data.membrane = parsed_protein_data_drawareas[1];
        parsed_protein_data.draw_area = parsed_protein_data_drawareas[2];
        parsed_protein_data.resid_properties = properties;
        parsed_protein_data.color_rules = color_rules;
        parsed_protein_data.draw_symbols = text_to_draw;
        parsed_protein_data.residue_relations = relationships;
        drawEverything(parsed_protein_data);
        console.log("generated plot!");
    }

    /**
     * Helper function for rounding a number up to a given decimal place
     * @param {number} num number to be rounded
     * @param {number} after_comma number of decimal places to round to
     * @namespace
     * @exports NaView
     * @name roundDecimals
     * @yields {number} rounded number up to given decimal places
     */
    function roundDecimals(num, after_comma) {
        let ten_basis = Math.pow(10, after_comma)
        return Math.round( num * ten_basis + Number.EPSILON ) / ten_basis;
    }

    /**
     * Helper function for generating random integer number between two numbers, including those numbers
     * @param {number} min  minimum number to generate integer from
     * @param {number} max maximum number to generate integer to
     * @namespace
     * @exports NaView
     * @name getRandomIntInclusive
     * @yields {number} integer number between min and max
     */
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Helper function for generating random float number between two numbers, including those numbers
     * @param {number} min minimum number to generate float from
     * @param {number} max maximum number to generate float to
     * @namespace
     * @exports NaView
     * @name getRandomFloatInclusive
     * @yields {number} float number between min and max
     */
    function getRandomFloatInclusive(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Helper function for creating an Array of substrings of length n from a string
     * @param {string} str string to generate substrings from
     * @param {number} n length of desired substrings
     * @namespace
     * @exports NaView
     * @name stringToChunks
     * @yields Array of substrings
     */
    function stringToChunks(str, n) {
        var ret = [];
        var i;
        var len;
    
        for(i = 0, len = str.length; i < len; i += n) {
           ret.push(str.substr(i, n))
        }
    
        return ret
    };

    /**
     * Helper function for creating an Array of substrings of the alternating lengths n and s from a string
     * @param {string} str string to generate substrings from
     * @param {number} n alternating length 1 of desired substrings
     * @param {number} s alternating length 2 of desired substrings
     * @namespace
     * @exports NaView
     * @name stringToChunksSkip
     * @see stringToChunks for original function this was based on
     * @yields Array of substrings
     */
    function stringToChunksSkip(str, n, s) {
        var ret = [];
        var i;
        var len;
    
        // for(i = 0, len = str.length; i < len; i += n) {
        //    ret.push(str.substr(i, n))
        // }
        let to_skip = false;
        let done_n = 0;
        let temp = "";
        for (let i = 0, len = str.length; i < len; i++) {
            temp += str[i];
            done_n += 1;
            if (to_skip === false) {
                if (done_n === n) {
                    ret.push(temp);
                    temp = "";
                    done_n = 0;
                    to_skip = true;
                }
            } else {
                if (done_n === s) {
                    ret.push(temp);
                    temp = "";
                    done_n = 0;
                    to_skip = false;
                }
            }
        }
        if (temp.length > 0) {
            ret.push(temp);
        }
    
        return ret
    };

    /**
     * Helper function for generating an Array composed of ascending integers
     * @param {number} size number of integers in final Array
     * @param {number} startAt starting number to ascend from
     * @namespace
     * @exports NaView
     * @name rangeArray
     * @yields Array of ascending numbers
     */
    function rangeArray(size, startAt = 0) {
        return [...Array(size).keys()].map(i => i + startAt);
    }

    /**
     * Helper function for generating a deep copy of an Object
     * @param {Object} obj obj to generate deep copy
     * @namespace
     * @exports NaView
     * @name deepCopy
     * @yields {Object} deep copy of obj input 
     */
    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Helper function for returning any color as an Array of [r, g, b, a]
     * @param {string} color color string. Must be a valid canvas fillStyle
     * @namespace
     * @exports NaView
     * @name colorToRGBA
     * @yields {Array} [r, g, b, a] color Array generated from a ghost canvas
     */
    function colorToRGBA(color) {
        var cvs, ctx;
        cvs = document.createElement('canvas');
        cvs.height = 1;
        cvs.width = 1;
        ctx = cvs.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        return ctx.getImageData(0, 0, 1, 1).data;
    }

    /**
     * Helper library to lighten/darken colors
     * @namespace
     * @exports NaView
     * @name pSBC
     * @see  {@link https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)} for further information.
     */
    function pSBC(p,c0,c1,l) {
        let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
        if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
        if(!this.pSBCr)this.pSBCr=(d)=>{
            let n=d.length,x={};
            if(n>9){
                [r,g,b,a]=d=d.split(","),n=d.length;
                if(n<3||n>4)return null;
                x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
            }else{
                if(n==8||n==6||n<4)return null;
                if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
                d=i(d.slice(1),16);
                if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
                else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
            }return x};
        h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
        if(!f||!t)return null;
        if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
        else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
        a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
        if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
        else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
    }

    /**
     * Helper function for returning unique elements when passed to the Array.prototype.filter() method.
     * @param {number} value value of current Array Object
     * @param {number} index index of current Array Object
     * @param {Array} self any possible Array
     * @namespace
     * @exports NaView
     * @name onlyUnique
     * @example [1,2,2,3,3,4].filter(onlyUnique) returns [1,2,3,4]
     * @yields {Boolean} true when an Object is in Array, false when not
     */
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    /**
     * Parses a UniProt formatted text string
     * to the required data format for plotting a NaV channel.<br><br>
     * Required line types include:<br>
     * 1. The FT (Feature Table) lines for:<br>
     *      a) TOPO_DOM - Topological domain<br>
     *      b) TRANSMEM - Extent of a transmembrane region<br>
     *      c) INTRAMEM - Extent of a region located in a membrane without crossing it<br>
     *      d) CHAIN - Extent of a polypeptide chain in the mature protein.<br>
     *      e) REPEAT - Extent of an internal sequence repetition.<br>
     * 2. The SQ (SeQuence header) lines
     * @param {string} test_raw_protein UniProt text formatted object with needed FT and SQ lines
     * @namespace
     * @exports NaView
     * @name processRawUniProt
     * @yields {Object} Object containing:<br>
     * 1.fullseq: full protein sequence<br>
     * 2.data: generated data Array containing information of each to be drawn protein element<br>
     * 3.count_data: counts per each element type and domain in protein<br>
     * 4.resid_properties: Object with an index for each residue in protein (1,2,3,4... corresponding to each amino acid)
     * @see {@link https://www.uniprot.org/docs/userman.htm} for information on the UniProt text format
     */
    function processRawUniProt(test_raw_protein) {
        let test_raw_protein_lines = test_raw_protein.split("\n");
        
        let start_chain = false;
        let end_chain = false;
        let start_chain_aa,end_chain_aa;
        let prev_test_raw_protein_line = "";
        let doms_to_resnums = {};
        let line_of_interest_queries = {
            "FT   TOPO_DOM": "loop",
            "FT   INTRAMEM": "pore",
            "FT   TRANSMEM": "helix"
        };
        let lines_of_interest = [];
        let dom_counts = {};
        let dom_type_counts = {};
        for (let irpl = 0; irpl < test_raw_protein_lines.length; irpl++) {
            let test_raw_protein_line = test_raw_protein_lines[irpl];
            if (test_raw_protein_line.length > 13) {
                let header_str = test_raw_protein_line.substr(0, 13);
                if (start_chain === false && end_chain === false) {
                    if (header_str === "FT   CHAIN   ") {
                        start_chain_aa = parseInt(test_raw_protein_line.split("FT   CHAIN   ")[1].split("..")[0].replace(/\s+/, ""));
                        end_chain_aa = parseInt(test_raw_protein_line.split("FT   CHAIN   ")[1].split("..")[1]);
                        start_chain = true;
                        continue;
                    }
                } else if (start_chain === true && end_chain === false)  {
                    if (Object.keys(line_of_interest_queries).indexOf(header_str) > -1) {
                        let array_lines = [header_str, test_raw_protein_line];
                        let note_line = test_raw_protein_lines[irpl+1];
                        if (note_line.includes("/note=") === true) {
                            array_lines.push(note_line);
                        }
                        lines_of_interest.push(array_lines);
                    }
                    if (prev_test_raw_protein_line.includes(".."+end_chain_aa)) {
                        end_chain = true;
                        continue;
                    }
                }
                if (header_str === "FT   REPEAT  ") {
                    let note_line = test_raw_protein_lines[irpl+1];
                    let dom_name = note_line.split('/note="')[1].replace(/\"/, "");

                    let dom_start_aa = parseInt(test_raw_protein_line.split("FT   REPEAT  ")[1].split("..")[0].replace(/\s+/, ""));
                    let dom_end_aa = parseInt(test_raw_protein_line.split("FT   REPEAT  ")[1].split("..")[1]);

                    doms_to_resnums[dom_name] = [dom_start_aa, dom_end_aa];
                    dom_counts[dom_name] = 0;
                    dom_type_counts[dom_name] = {};
                    dom_type_counts[dom_name]["loop"] = 0;
                    dom_type_counts[dom_name]["helix"] = 0;
                    dom_type_counts[dom_name]["pore"] = 0;
                }
                if (header_str === "SQ   SEQUENCE") {
                    let aa_num = parseInt(test_raw_protein_line.split("SQ   SEQUENCE")[1].split(" AA;")[0].replace(/\s+/, ""));
                    if (aa_num !== end_chain_aa) {
                        return false;
                    }
                    sequence = "";
                    for (let irpl1 = irpl+1; irpl1 < test_raw_protein_lines.length; irpl1++) {
                        if (test_raw_protein_lines[irpl1].includes("//") === false) {
                            let aminoacids_in_line = test_raw_protein_lines[irpl1].replace(/\s+/g, "");
                            sequence = sequence + aminoacids_in_line;
                        }
                    }
                }
            }
            prev_test_raw_protein_line = test_raw_protein_line;
        }
        let parsed_data = [];
        let previous_domain = false;
        let type_aacounts = {
            "loop":0,
            "helix":0,
            "pore":0,
        };
        let border_count = 0;
        let type_full_counts = {
            "loop":0,
            "helix":0,
            "pore":0,
            "internal_loop":0
        }
        let aacounts_per_type = {
            "loop":[],
            "helix":[],
            "pore":[],
            "internal_loop":[]
        }
        for (let ilip = 0; ilip < lines_of_interest.length; ilip++) {
            let array_lines = lines_of_interest[ilip];
            let resid_start_aa = parseInt(array_lines[1].split(array_lines[0])[1].split("..")[0].replace(/\s+/, ""));
            let resid_end_aa = parseInt(array_lines[1].split(array_lines[0])[1].split("..")[1]);
            let line_type = line_of_interest_queries[array_lines[0]];

            let aa_count = (resid_end_aa-resid_start_aa+1);
            type_aacounts[line_type] += aa_count;
            type_full_counts[line_type] += 1;
            aacounts_per_type[line_type].push(aa_count);
            if (ilip === 0 || ilip === lines_of_interest.length-1) {
                border_count += aa_count;
            } else if (line_type === "loop") {
                type_full_counts["internal_loop"] += 1;
                aacounts_per_type["internal_loop"].push(aa_count);
            }
        }
        end_chain_aa_alldomains = end_chain_aa - border_count;

        type_aacounts["internal_helix"] = type_aacounts["helix"];// - border_count;
        type_aacounts["internal_loop"] = type_aacounts["loop"] - border_count;
        type_aacounts["internal_pore"] = type_aacounts["pore"];// - border_count;

        let type_index = {
            "loop":0,
            "helix":0,
            "pore":0,
            "internal_loop":0
        };
        let next_domain = {
            "I": "II",
            "II": "III",
            "III": "IV",
        }
        let count_inter_domain = 1;
        for (let ili = 0; ili < lines_of_interest.length; ili++) {
            let array_lines = lines_of_interest[ili];
            
            let line_type = line_of_interest_queries[array_lines[0]];
            type_index[line_type] += 1;
            if (ili > 0 && ili < lines_of_interest.length-1 && line_type === "loop") {
                type_index["internal_loop"] += 1;
            }

            let noteworthy = array_lines["2"].split('/note="')[1].split('"')[0];

            let resid_start_aa = parseInt(array_lines[1].split(array_lines[0])[1].split("..")[0].replace(/\s+/, ""));
            let resid_end_aa = parseInt(array_lines[1].split(array_lines[0])[1].split("..")[1]);

            let aminoacids_of_interest = sequence.split("").slice(resid_start_aa-1, resid_end_aa);

            let current_dom = false;

            for (const dom_name in doms_to_resnums) {
                if (doms_to_resnums.hasOwnProperty(dom_name)) {
                    let dom_bounds = doms_to_resnums[dom_name];
                    if ((resid_start_aa >= dom_bounds[0] && resid_start_aa <= dom_bounds[1]) && (resid_end_aa >= dom_bounds[0] && resid_end_aa <= dom_bounds[1])) {
                        current_dom = dom_name;
                    }
                }
            }

            if (current_dom) {
                dom_counts[current_dom] += 1;
                dom_type_counts[current_dom][line_type] += 1;
            }

            let export_obj = {
                "type": line_type,
                "start": resid_start_aa,
                "end": resid_end_aa,
                "aanum": resid_end_aa-resid_start_aa+1,
                //frequencies by various parsing modes
                "aaperc_full": (resid_end_aa-resid_start_aa+1)/end_chain_aa,
                "aaperc_bytype_full": (resid_end_aa-resid_start_aa+1)/type_aacounts[line_type],
                "aas": aminoacids_of_interest.join(""),
                "type_i_full": type_index[line_type],
                "id": (ili+1),
                "prev_dom_name": previous_domain,
                "next_dom_name": next_domain[previous_domain],
                "note": noteworthy,
            }
            if (current_dom) {
                export_obj["dom_name"] = current_dom;
                export_obj["dom_i"] = dom_counts[current_dom];
                export_obj["dom_itype"] = dom_type_counts[current_dom][line_type];
                // export_obj["type_i_domains"]: type_index["internal_loop"],
                export_obj["aaperc_alldomains"] = (resid_end_aa-resid_start_aa+1)/end_chain_aa_alldomains;
                export_obj["aaperc_bytype_alldomains"] = (resid_end_aa-resid_start_aa+1)/type_aacounts["internal_"+line_type];
            } else {
                export_obj["dom_name"] = false;
                export_obj["dom_i"] = false;
                export_obj["dom_itype"] = false;
                export_obj["dom_iname"] = count_inter_domain;
                count_inter_domain += 1;
            }
            parsed_data.push(export_obj);

            previous_domain = current_dom;
        }
        let count_data = {
            "type": type_full_counts,
            "aacounts_per_type": aacounts_per_type,
        }
        let sequence_properties = {};
        for (let is = 0; is < sequence.length; is++) {
            if (sequence_properties.hasOwnProperty(is+1) === false) {
                sequence_properties[is+1] = {};
            }
        }
        return {"fullseq": sequence,"data": parsed_data, "count_data": count_data, "resid_properties": sequence_properties};
    }

    /**
     * Calculates draw areas for each element to be drawn on plot
     * @param {Array} array_data data generated from processRawUniProt
     * @namespace
     * @exports NaView
     * @name define_draw_areas
     * @namespace
     * @yields {Array} Array of three draw areas: protein data from processRawUniProt alongside draw areas, draw area for membrane, SVG draw area with borders and membrane main coords
     */
    function define_draw_areas(array_data) {
        var valorInicial = 0.0;
        var perc_total = array_data.reduce(function(acumulador, valorAtual, index, array) {
            return acumulador + valorAtual.aaperc;
        }, valorInicial);
        let svg_drawing_area = createDrawingArea();
        let parsed_lines_data = drawDataParsing(array_data);
        let dom_idom_data = calcDomIDomWidths(svg_drawing_area, parsed_lines_data["domain_names"], parsed_lines_data["helices_and_pores_by_domain"]); // to_print
        let longLoopWidthF = distributeLongLoopsWidth(dom_idom_data["inter_domain_width"], parsed_lines_data["long_loops"]);
        let indexed_drawareas = calcElementsDrawAreas(array_data, svg_drawing_area, parsed_lines_data["domain_names"], parsed_lines_data["helices_and_pores_by_domain"],parsed_lines_data["internal_short_loops_by_domain"],parsed_lines_data["long_loops_by_prevdomain"],longLoopWidthF, dom_idom_data["total_domain_width"],dom_idom_data["inter_domain_width"]);
        for (let id = 0; id < array_data.length; id++) {
            let nid = array_data[id].id;
            array_data[id]["draw_area"] = indexed_drawareas.protein[nid];
        }
        return [array_data, indexed_drawareas.membrane, svg_drawing_area];
    }

    /**
     * Calculates main plot draw areas for borders and membrane site
     * @exports NaView
     * @name createDrawingArea
     * @namespace
     * @yields {Object} SVG draw area with borders and membrane main coords
     */
    function createDrawingArea() {
        let da_stx = svg_width * style_obj["canvas"]["border"]["left"];
        let da_width = svg_width - (da_stx+(svg_width * style_obj["canvas"]["border"]["right"]));
        let da_etx = da_stx + da_width;
        let da_sty = svg_height * style_obj["canvas"]["border"]["top"];
        let da_height = svg_height - (da_sty+(svg_height*style_obj["canvas"]["border"]["bottom"]));
        let da_ety = da_sty + da_height;
        let da_ms = (da_height/2) - (svg_height*style_obj["membrane"]["membrane_region_height"])/2;
        let da_me = (da_height/2) + (svg_height*style_obj["membrane"]["membrane_region_height"])/2;
        let da_mh = svg_height*style_obj["membrane"]["membrane_region_height"];
        svg_drawarea = {
            "start_x": da_stx,
            "end_x": da_etx,
            "width": da_width,
            "start_y": da_sty,
            "end_y": da_ety,
            "height": da_height,
            "membrane_start": da_ms,
            "membrane_height": da_mh,
            "membrane_end": da_me,
        }
        return svg_drawarea;
    }

    /**
     * Separates parsed protein data array into sub groups according to protein element types (helix, pore, internal and external loops)
     * @param {Array} array_data data generated from processRawUniProt
     * @exports NaView
     * @name drawDataParsing
     * @namespace
     * @yields {Object} JSON containing array_data separated by protein element type (helix, pore, internal and external loops)
     */
    function drawDataParsing(array_data) {
        let helices_and_pores = array_data.filter(function(a) {
            return a.type === "helix" || a.type === "pore";
        });
    
        let helices_and_pores_by_domain = helices_and_pores.reduce( (reduce_dict, a) => {
            reduce_dict[a.dom_name] = [...reduce_dict[a.dom_name] || [], a];
            return reduce_dict;
        }, {});
    
        let internal_short_loops =  array_data.filter(function(a) {
            return a.type === "loop" && a.dom_name !== false;
        });
    
        let internal_short_loops_by_domain = internal_short_loops.reduce( (reduce_dict, a) => {
            reduce_dict[a.dom_name] = [...reduce_dict[a.dom_name] || [], a];
            return reduce_dict;
        }, {});
        
        let long_loops = array_data.filter(function(a) {
            return a.type === "loop" && a.prev_dom_name !== false && a.dom_name === false && a.next_dom_name;
        });
    
        let long_loops_by_prevdomain = long_loops.reduce( (reduce_dict, a) => {
            // reduce_dict[a.prev_dom_name] = [...reduce_dict[a.prev_dom_name] || [], a];
            reduce_dict[a.prev_dom_name] = a;
            return reduce_dict;
        }, {});
    
        let domain_names = Object.keys(helices_and_pores_by_domain);
        
        let result_obj = {
            "helices_and_pores": helices_and_pores,
            "helices_and_pores_by_domain": helices_and_pores_by_domain,
            "internal_short_loops": internal_short_loops,
            "internal_short_loops_by_domain": internal_short_loops_by_domain,
            "long_loops": long_loops,
            "long_loops_by_prevdomain": long_loops_by_prevdomain,
            "domain_names": domain_names,
        }
        return result_obj;
    }

    /**
     * Calculates each domain width from style_obj, determines full interdomain width
     * @param {Object} svg_drawing_area SVG draw area with borders and membrane main coords
     * @param {Array} domain_names list of domain names
     * @param {Array} helices_and_pores_by_domain Array of Objects from processRawUniProt for helices and pores of each domain
     * @exports NaView
     * @name calcDomIDomWidths
     * @namespace
     * @yields {Object} JSON for total domain width, interdomain width and dictionary for each domain's width
     */
    function calcDomIDomWidths(svg_drawing_area, domain_names, helices_and_pores_by_domain) {
        let total_domain_width = 0;
        let domain_to_width = {};
        for (let idn = 0; idn < domain_names.length; idn++) {
            let domain_name = domain_names[idn];
            let domain_width = 0;
            // let domain_spacing_width = (helices_and_pores_by_domain[domain_name].length-1)* style_obj["protein"]["helix_spacing_width"];
            let domain_spacing_width = style_obj["protein"]["helix_spacing_width"][domain_name].reduce(function(r, a) {
                return r + a;
            }, 0);
            domain_width += domain_spacing_width;
            let total_perc_width = style_obj["protein"]["helix_region_width"][domain_name].reduce(function(r, a) {
                return r + a;
            }, 0);
            let domain_helices_width = svg_width * total_perc_width;
            domain_width += domain_helices_width;
            let domain_pore_width = svg_width * style_obj["protein"]["pore_region_width"][domain_name];
            domain_width += domain_pore_width;
            domain_to_width[domain_name] = domain_width;
            total_domain_width += domain_width;
        }
        let n_ter_width = svg_width * style_obj["protein"]["nter_loop_width"];
        let c_ter_width = svg_width * style_obj["protein"]["cter_loop_width"];
    
        let inter_domain_width = svg_drawing_area["width"] - (total_domain_width+n_ter_width+c_ter_width);
    
        let return_obj = {
            "total_domain_width":total_domain_width,
            "inter_domain_width":inter_domain_width,
            "domain_to_width":domain_to_width
        }
        return return_obj;
    }

    /**
     * Creates scale functions for calculating the interdomain loops widths.<br>
     * Three setups are possible as defined in the style_obj:<br>
     * 1. Custom: user defined inside the style_obj <br>
     * 2. Scaled: according to amino acid number of each loop<br>
     * 3. Fixed: equally divided between the different loops <br>
     * @param {number} total_width the total interdomain width to be distributed
     * @param {Array} long_loops_array Array containing the interdomain loop objects from processRawUniProt
     * @exports NaView
     * @name distributeLongLoopsWidth
     * @namespace
     * @yields {Function} scale function for calculating the interdomain loops width
     */
    function distributeLongLoopsWidth(total_width, long_loops_array) {
        let loops_print_vars = style_obj["protein"]["long_loops_draw_opts"];
        let w_dist = loops_print_vars["width"];
        // let calc_len = loops_print_vars["calc_len"];
        let length_function;
        switch (w_dist.type) {
            case "custom":
                length_function = function(context) {
                    return svg_width * calc_len[context];
                }
                break;
            case "scaled":
                let total_aanum = long_loops_array.reduce(function(r, a){
                    return r + a.aanum;
                }, 0);
                length_function = d3.scaleLinear().range([0, total_width]).domain([0, total_aanum]);
                break;
            case "reslen":
                //this one requires pre-rendering which has not been implemented
                break;
            default: //fixed
                length_function = function(context) {
                    return total_width / long_loops_array.length;
                }
                break;
        }
        return length_function;
    }

    /**
     * Calculates main plot area for drawing the membrane
     * @param {Object} drawing_area SVG draw area with borders and membrane main coords
     * @exports NaView
     * @name calculateDrawAreaMembrane
     * @namespace
     * @yields {Object} draw area object for drawing the plasmatic membrane
     */
    function calculateDrawAreaMembrane(drawing_area) {
        let el_stx = drawing_area["start_x"];
        let el_etx = drawing_area["end_x"];
        let el_width = el_etx-el_stx;
    
        let el_sty = drawing_area["membrane_start"];
        let el_ety = drawing_area["membrane_end"];
        let el_height = el_ety-el_sty;
    
        let positioned_element = {
            "start_x": el_stx,
            "end_x": el_etx,
            "width": el_width,
            "start_y": el_sty,
            "end_y": el_ety,
            "height": el_height,
        };
        return positioned_element;
    }

    /**
     * Calculates main plot area for drawing N or C terminus loops by using style_obj definitions
     * @param {String} terminus_type N or C for the respective terminus type
     * @param {Object} drawing_area  SVG draw area with borders and membrane main coords
     * @param {Object} terminus_data  Object containing the terminus object from processRawUniProt
     * @param {number} total_domain_width total plot width for domain elements
     * @param {number} inter_domain_width total plot width for interdomain loops
     * @exports NaView
     * @name calculateDrawAreaTermini
     * @namespace
     * @yields {Object} draw area object for drawing N or C terminus loops
     */
    function calculateDrawAreaTermini(terminus_type, drawing_area, terminus_data, total_domain_width,inter_domain_width) {
        let return_obj = {
            "objs": [],
            "end_x": 0,
        };
        let el_stx = drawing_area["start_x"];
        let el_width = svg_width * style_obj["protein"]["nter_loop_width"];
        
        if (terminus_type === "C") {
            el_stx = drawing_area["start_x"]+el_width+(total_domain_width+inter_domain_width);
            el_width = svg_width * style_obj["protein"]["cter_loop_width"];
        }
        let el_etx = el_stx + el_width;
    
        let el_sty = drawing_area["start_y"];
        let el_ety = drawing_area["membrane_start"];
        if (terminus_data.note === "Cytoplasmic") {
            el_sty = drawing_area["membrane_end"];
            el_ety = drawing_area["end_y"];
        }
        let el_height = el_ety-el_sty;
    
        let positioned_element = {
            "start_x": el_stx,
            "end_x": el_etx,
            "width": el_width,
            "start_y": el_sty,
            "end_y": el_ety,
            "height": el_height,
        };
        terminus_data["draw_area"] = positioned_element;
        return_obj["objs"].push(terminus_data);
        return return_obj;
    }

    /**
     * Calculates main plot area for drawing domain intramembranar helices or pores by using style_obj definitions
     * @param {String} domain_name Name of current domain (I, II, III, IV)
     * @param {Array} helices_and_pores_array Array of Objects from processRawUniProt for helices and pores of each domain
     * @param {Object} drawing_area SVG draw area with borders and membrane main coords
     * @param {number} cumulative_x cumulative width of previously determined plot elements (left to right)
     * @exports NaView
     * @name calculateDrawAreaHelicesPoresByDomain
     * @namespace
     * @yields {Object} draw area object for drawing domain intramembranar helices or pores
     */
    function calculateDrawAreaHelicesPoresByDomain(domain_name, helices_and_pores_array, drawing_area, cumulative_x) {
        let return_obj = {
            "objs": [],
            "end_y": 0,
            "end_x": 0,
        };
        let accumulated_x = cumulative_x;
        let hcount = 0;

        let prev_dom_name;
        let dom_index = -1;
        for (let iel = 0; iel < helices_and_pores_array.length; iel++) {
            let helix_or_pore = helices_and_pores_array[iel];
            let dom_name = helix_or_pore["dom_name"];
            let el_stx = accumulated_x;
            let el_sty = drawing_area["membrane_start"];
            let el_width = 0; //style_obj["protein"]["helix_width"];
            let el_height = 0; //style_obj["protein"]["helix_height"];
            if (dom_name !== prev_dom_name) {
                dom_index = -1;
                prev_dom_name = dom_name + "";
            }
            dom_index += 1;
            if (helix_or_pore.type === "pore") {
                el_width = svg_width * style_obj["protein"]["pore_region_width"][domain_name];
                el_height = svg_height * style_obj["protein"]["pore_region_height"][domain_name];
            } else {
                el_width = svg_width * style_obj["protein"]["helix_region_width"][domain_name][hcount];
                el_height = svg_height * style_obj["protein"]["helix_region_height"][domain_name][hcount];
                hcount += 1;
            }
            let positioned_element = {
                "start_x": el_stx,
                "end_x": (el_stx+el_width),
                "width": el_width,
                "start_y": el_sty,
                "end_y": (el_sty+el_height),
                "height": el_height,
            };
            helices_and_pores_array[iel]["draw_area"] = positioned_element;
            return_obj["objs"].push(helices_and_pores_array[iel]);
            return_obj["end_y"] = el_sty+el_height;

            accumulated_x += el_width;
            // let helixpore_spacing = style_obj["protein"]["helix_spacing_width"];
            let helixpore_spacing = style_obj["protein"]["helix_spacing_width"][dom_name][dom_index];
            if (iel < helices_and_pores_array.length-1) {
                // helixpore_spacing = (iel+1) * style_obj["protein"]["helix_spacing_width"];
                accumulated_x += helixpore_spacing;
            }
        }
        return_obj["end_x"] = accumulated_x;
        return return_obj;
    }

    /**
     * Inserts processRawUniProt objects containing draw areas in a dictionary according to their N to C termini indexa and style_obj definitions
     * @param {Object} protein_dict Object containing each processRawUniProt object according to their N to C termini index
     * @param {Array} array_to_dict Array of processRawUniProt objects containing draw areas
     * @exports NaView
     * @name indexDrawAreas
     * @namespace
     * @yields {Object} protein_dict Object containing each processRawUniProt object according to their N to C termini index
     */
    function indexDrawAreas(protein_dict, array_to_dict){
        for (let iatd = 0; iatd < array_to_dict.length; iatd++) {
            let obj = array_to_dict[iatd];
            protein_dict[obj.id] = obj.draw_area;
        }
        return protein_dict;
    }

    /**
     * Calculates main plot area for drawing domain loops connecting helices or pores and style_obj definitions
     * @param {Array} internal_short_loops_array Array of Objects from processRawUniProt for loops connecting helices and pores of each domain
     * @param {Array} helixpore_objs Array of Objects from processRawUniProt for helices and pores of each domain
     * @param {Object} drawing_area SVG draw area with borders and membrane main coords
     * @param {number} cumulative_x cumulative width of previously determined plot elements (left to right)
     * @exports NaView
     * @name calculateDrawAreaShortLoopsByDomain
     * @yields {Object} draw area object for drawing domain loops connecting helices or pores
     * @namespace 
     */
    function calculateDrawAreaShortLoopsByDomain(internal_short_loops_array, helixpore_objs, drawing_area, cumulative_x) {
        let return_obj = {
            "objs": [],
            "width": 0,
            "end_y": 0,
        };
    
        let accumulated_x = cumulative_x;
        for (let isl = 0; isl < internal_short_loops_array.length; isl++) {
            let current_internal_short_loop = internal_short_loops_array[isl];
            let previous_helixpore_el = helixpore_objs[isl];
            let next_helixpore_el = helixpore_objs[isl+1];
            // let el_stx = accumulated_x; //end of previous element
            let el_stx = previous_helixpore_el["draw_area"]["end_x"] - previous_helixpore_el["draw_area"]["width"]/2;
            let el_etx = next_helixpore_el["draw_area"]["start_x"] + next_helixpore_el["draw_area"]["width"]/2;
            let el_width = el_etx-el_stx;
    
            let el_sty = drawing_area["start_y"];
            let el_ety = drawing_area["membrane_start"];
            if (current_internal_short_loop.note === "Cytoplasmic") {
                el_sty = drawing_area["membrane_end"];
                el_ety = drawing_area["end_y"];
            }
            let el_height = el_ety-el_sty;
    
            let positioned_element = {
                "start_x": el_stx,
                "end_x": el_etx,
                "width": el_width,
                "start_y": el_sty,
                "end_y": el_ety,
                "height": el_height,
            };
            internal_short_loops_array[isl]["draw_area"] = positioned_element;
            return_obj["objs"].push(internal_short_loops_array[isl]);
        }
        return return_obj;
    }

    /**
     * Calculates main plot area for drawing interdomain loops by using style_obj definitions
     * @param {Object} long_loop_obj Object containing each processRawUniProt interdomain loop object
     * @param {number} cumulative_x cumulative width of previously determined plot elements (left to right)
     * @param {number} last_y plot y positioning of the last intradomain helix (Helix:6)
     * @param {Function} longLoopWidthF scale function for calculating the interdomain loops width from <i><b>distributeLongLoopsWidth</b></i>
     * @param {Object} drawing_area  SVG draw area with borders and membrane main coords
     * @exports NaView
     * @name calculateDrawAreaLongLoops
     * @yields {Object} draw area object for drawing interdomain loops
     * @namespace
     */
    function calculateDrawAreaLongLoops(long_loop_obj, cumulative_x, last_y, longLoopWidthF, drawing_area) {
        let return_obj = {
            "objs": [],
            "end_x": 0,
        };
        let accumulated_x = cumulative_x;
        
        let prev_dom_helix_data = style_obj["protein"]["helix_region_width"][long_loop_obj.prev_dom_name];
        let prev_dom_helix_data_sub = (svg_width * (prev_dom_helix_data[prev_dom_helix_data.length-1])/2)
        let next_dom_helix_data = style_obj["protein"]["helix_region_width"][long_loop_obj.next_dom_name];
        let next_dom_helix_data_add = (svg_width * (next_dom_helix_data[0])/2)
    
        let el_stx = accumulated_x - prev_dom_helix_data_sub;
    
        let context_data = long_loop_obj;
        if (style_obj["protein"]["long_loops_draw_opts"]["width"]["type"] !== "custom") {
            context_data = long_loop_obj.aanum;
        }
    
        // let calc_width = longLoopWidthF(long_loop_obj.aanum);
        let calc_width = longLoopWidthF(context_data);
        let el_width = calc_width + prev_dom_helix_data_sub + next_dom_helix_data_add;
        // let el_etx = accumulated_x + el_width;
    
        let el_sty = drawing_area["start_y"];
        let el_ety = drawing_area["membrane_start"];
        if (long_loop_obj.note === "Cytoplasmic") {
            el_sty = drawing_area["membrane_end"];
            el_ety = drawing_area["end_y"];
        }
        let el_height = el_ety-el_sty;
        let positioned_element = {
            "start_x": el_stx,
            "end_x": (el_stx+el_width),
            "width": el_width,
            "start_y": el_sty,
            "end_y": (el_sty+el_height),
            "height": el_height,
        };
        long_loop_obj["draw_area"] = positioned_element;
        return_obj["objs"].push(long_loop_obj);
        // accumulated_x += longLoopWidthF(long_loop_obj.aanum);
        accumulated_x += longLoopWidthF(context_data);
        return_obj["end_x"] = accumulated_x;
        return return_obj;
    }

    /**
     * Function organizes protein element order for generating draw areas for every protein and membrane elements.<br>
     * @see calculateDrawAreaMembrane
     * @see calculateDrawAreaTermini
     * @see calculateDrawAreaHelicesPoresByDomain
     * @see indexDrawAreas
     * @see calculateDrawAreaLongLoops
     * @param {Array} array_data data generated from processRawUniProt
     * @param {Object} svg_drawing_area SVG draw area with borders and membrane main coords
     * @param {Array} domain_names list of names for each domain(I,II,III,IV)
     * @param {Object} helices_and_pores_by_domain dictionary for helices and pore elements according to their domain names (I,II,III,IV)
     * @param {Object} internal_short_loops_by_domain dictionary for loops connecting helices and pore elements according to their domain names (I,II,III,IV)
     * @param {Object} long_loops_by_prevdomain dictionary for interdomain loop elements according to their previous domain names (I,II,III)
     * @param {Function} longLoopWidthF scale function for calculating the interdomain loops width from <i><b>distributeLongLoopsWidth</b></i>
     * @param {number} total_domain_width total plot width for domain objects
     * @param {number} inter_domain_width total plot width for interdomain objects
     * @exports NaView
     * @name calcElementsDrawAreas
     * @namespace
     * @yields {Object} Object containing draw areas for every protein and membrane elements
     */
    function calcElementsDrawAreas(array_data, svg_drawing_area, domain_names, helices_and_pores_by_domain, internal_short_loops_by_domain, long_loops_by_prevdomain, longLoopWidthF, total_domain_width, inter_domain_width) {
        let indexed_drawareas = {
            "protein": {},
            "membrane": undefined
        };
        let plines = [];
        
        let membrane_drawarea = calculateDrawAreaMembrane(svg_drawing_area);
        indexed_drawareas.membrane = membrane_drawarea;
        
        let cumulative_x = svg_drawing_area["start_x"] + (svg_width*style_obj["protein"]["nter_loop_width"]); //cter_loop_width
    
        let n_terminus_data = array_data[0];
        let n_terminus_drawarea = calculateDrawAreaTermini("N", svg_drawing_area, n_terminus_data,total_domain_width, inter_domain_width);
        // indexed_drawareas.protein[0] = n_terminus_drawarea.objs[0].draw_area;
        indexed_drawareas.protein[1] = n_terminus_drawarea.objs[0].draw_area;
    
        let c_terminus_data = array_data[array_data.length-1];
        let c_terminus_drawarea = calculateDrawAreaTermini("C", svg_drawing_area, c_terminus_data,total_domain_width, inter_domain_width);
        // indexed_drawareas.protein[array_data.length-1] = c_terminus_drawarea.objs[c_terminus_drawarea.objs.length-1].draw_area;
        indexed_drawareas.protein[array_data.length] = c_terminus_drawarea.objs[c_terminus_drawarea.objs.length-1].draw_area;
    
        for (let idn = 0; idn < domain_names.length; idn++) {
            let domain_name = domain_names[idn];
    
            let domain_assignment_results_helixpore = calculateDrawAreaHelicesPoresByDomain(domain_name, helices_and_pores_by_domain[domain_name], svg_drawing_area, cumulative_x);
            indexed_drawareas.protein = indexDrawAreas(indexed_drawareas.protein, domain_assignment_results_helixpore.objs);
    
            let domain_assignment_results_shortloops = calculateDrawAreaShortLoopsByDomain(internal_short_loops_by_domain[domain_name], domain_assignment_results_helixpore.objs, svg_drawing_area, cumulative_x);
            indexed_drawareas.protein = indexDrawAreas(indexed_drawareas.protein, domain_assignment_results_shortloops.objs);
    
            // cumulative_x += domain_assignment_results_helixpore.width;
            // cumulative_x += domain_to_width[domain_name];
            cumulative_x = domain_assignment_results_helixpore.end_x;
            
            let last_y = domain_assignment_results_helixpore.end_y;
            let long_loop_obj = long_loops_by_prevdomain[domain_name];
            if (long_loop_obj) {
                let inter_domain_assignment_results = calculateDrawAreaLongLoops(long_loop_obj, cumulative_x, last_y, longLoopWidthF, svg_drawing_area);
                indexed_drawareas.protein = indexDrawAreas(indexed_drawareas.protein, inter_domain_assignment_results.objs);
                cumulative_x = inter_domain_assignment_results.end_x;
            }
        }
        return indexed_drawareas;
    }

    /**
     * Draws whole plot using various accessory functions
     * @param {Array} parsed_protein_data data generated from processRawUniProt containing draw areas
     * @exports NaView
     * @name drawEverything
     * @namespace
     * @see createFillRules
     * @see draw_membrane
     * @see mergeDrawData
     * @see createResidData
     * @see calculateResidOrientation
     * @see draw_helices
     * @see gen_shortloop_anchordata
     * @see draw_shortLoops
     * @see gen_poreloop_anchordata
     * @see draw_poreLoops
     * @see gen_longloop_anchordata
     * @see draw_longLoops
     * @see gen_termini_anchordata
     * @see draw_termini
     * @see createResidElementToCentroidData
     * @see draw_residue_relations
     * @see draw_symbols
     */
    function drawEverything(parsed_protein_data) {
        let membrane_data = parsed_protein_data.membrane;
        for (const membrane_draw_key in style_obj.membrane.membrane_draw_opts) {
            if (style_obj.membrane.membrane_draw_opts.hasOwnProperty(membrane_draw_key)) {
                membrane_data[membrane_draw_key] = style_obj.membrane.membrane_draw_opts[membrane_draw_key];
            }
        }
        current_resid_properties = deepCopy(parsed_protein_data.resid_properties);
        if (parsed_protein_data.hasOwnProperty("color_rules")) {
            createFillRules(parsed_protein_data.color_rules);
        }
        draw_membrane(membrane_data);
        let helices_data = parsed_protein_data.data.filter(function(a) {
            return a.type === "helix";
        });
        let helices_pores_data = parsed_protein_data.data.filter(function(a) {
            return a.type === "helix" || a.type === "pore";
        });
        let short_loop_data = parsed_protein_data.data.filter(function(a) {
            return a.type === "loop" && a.dom_name !== false;
        });
        let longloop_data = parsed_protein_data.data.filter(function(a) {
            return a.type === "loop" && a.dom_name === false && a.prev_dom_name && a.next_dom_name;
        });
        let nter_loop_data = parsed_protein_data.data.filter(function(a) {
            return a.type === "loop" && a.dom_name === false && a.prev_dom_name === false && !a.next_dom_name;
        });
        let cter_loop_data = parsed_protein_data.data.filter(function(a) {
            return a.type === "loop" && a.dom_name === false && a.prev_dom_name && !a.next_dom_name;
        });
        let all_loop_data = parsed_protein_data.data.filter(function(a) {
            return a.type === "loop";
        });
        let pores_data = parsed_protein_data.data.filter(function(a) {
            return a.type === "pore";
        });

        // let n_terminus_note = parsed_protein_data.data[0].note;

        helices_data = mergeDrawData("helix", helices_data);
        helices_data = createResidData(helices_data);
        helices_data = calculateResidOrientation(helices_data, all_loop_data);
        draw_helices(helices_data);

        short_loop_data = mergeDrawData("short_loops", short_loop_data);
        short_loop_data = createResidData(short_loop_data);
        short_loop_data = gen_shortloop_anchordata(short_loop_data, helices_pores_data);
        draw_shortLoops(short_loop_data);

        pores_data = mergeDrawData("pore_loops", pores_data);
        pores_data = createResidData(pores_data);
        pores_data = gen_poreloop_anchordata(pores_data, short_loop_data);
        draw_poreLoops(pores_data);

        longloop_data = mergeDrawData("long_loops", longloop_data);
        longloop_data = createResidData(longloop_data);
        longloop_data = gen_longloop_anchordata(longloop_data, helices_data);
        draw_longLoops(longloop_data);

        let sorted_helices = deepCopy(helices_data).sort(function(a, b) {
            return a.start - b.start;
        });

        nter_loop_data = mergeDrawData("nter_loop", nter_loop_data);
        nter_loop_data = createResidData(nter_loop_data);
        nter_loop_data = gen_termini_anchordata(nter_loop_data[0],sorted_helices[0], "N");
        draw_termini(nter_loop_data);

        cter_loop_data = mergeDrawData("cter_loop", cter_loop_data);
        cter_loop_data = createResidData(cter_loop_data);
        cter_loop_data = gen_termini_anchordata(cter_loop_data[0],sorted_helices[sorted_helices.length-1], "C");
        draw_termini(cter_loop_data);
        parsed_protein_data.residue_element_centroids = createResidElementToCentroidData();

        if (parsed_protein_data.hasOwnProperty("residue_relations")) {
            draw_residue_relations(parsed_protein_data.residue_relations, parsed_protein_data.residue_element_centroids,parsed_protein_data.data);
        }
        if (parsed_protein_data.hasOwnProperty("draw_symbols")) {
            draw_symbols(parsed_protein_data.draw_symbols, parsed_protein_data.residue_element_centroids,parsed_protein_data.resid_properties,parsed_protein_data.data);
        }
        if (parsed_protein_data.hasOwnProperty("color_rules")) {
            if (parsed_protein_data.color_rules.length > 0) {
                d3.selectAll(".element_path").style("visibility", "hidden");
                d3.selectAll(".residue_path").style("visibility", "");
            }
        }
    }

    /**
     * Resets global fillRules object and generates a new color filling object for each user defined color rule.<br>
     * When multiple user defined color rules are applied to the same residue/element, the last rule takes precedence.<br>
     * Color rules allow the selection of residues or elements (helices, pore, loops) by the "selection,color" syntax.<br>
     * Multiple "selection" possibilities are allowed including: <br>
     * "W" -> Selects all tryptophan residues <br>
     * "Trp" -> Select all tryptophan residues <br>
     * "1" -> Selects first residue of protein sequence <br>
     * "W1" -> Selects first residue of protein sequence <br>
     * "Trp1" -> Selects first residue of protein sequence <br>
     * "Domain:I" -> Selects first domain <br>
     * "Domain:I&Helix:1" -> Selects first domain <br>
     * "Domain:I&Loop:1" -> Selects first domain <br>
     * "Helix:1" -> Selects first helix of all domains <br>
     * "Loop:1" -> Selects first loop of all domains <br>
     * "Id:1" -> Selects first residue of protein sequence <br>
     * "ALL" -> Selects all protein residues <br>
     * The "color" possibilities include both named and hexadecimal colors: <br> <br>
     * "white" -> colors selection white <br>
     * "#FFFFFF" -> colors selection white <br>
     * an advanced color mapping to user inputted residue properties is also possible using the following syntax after a "selection" string: <br>
     * "by:Residue_Property_Name,color_range,color_property_domain" <br>
     * Residue_Property_Name -> refers to the user inputted residue property <br>
     * color_range -> a color range from each to map this property. valid examples: "white;green" or "red;white;blue" <br>
     * color_property_domain -> the color domain to which the color range refers to. valid examples: "min;max" (from minimum to maximum value), "0.0;0.5;1.0" <br>
     * @param {Array} data_color list of Strings inputted from user to generate per element/residue color filling rules
     * @namespace
     * @exports NaView
     * @name createFillRules
     */
    function createFillRules(data_color) {
        fillRules = [];
        for (let idc = 0; idc < data_color.length; idc++) {
            let fillObj = {
                "check_keys": [],
                "check_values":[],
                "color":undefined,
                "range":undefined,
                "domain":undefined,
                "get": undefined,
            };
            let selection_text = data_color[idc];
            let color_rule = selection_text.split(",")[0];
            let color_rule_keys = color_rule.split("&");
            for (let crk = 0; crk < color_rule_keys.length; crk++) {
                let color_rule = color_rule_keys[crk];
                if (/\d+/.test(color_rule)) {
                    let color_number = color_rule.match(/\d+/)[0];
                    let color_rule_type = color_rule.split(color_number+"")[0];
                    if (color_rule_type === "Helix:") {
                        fillObj.check_keys.push("type");
                        fillObj.check_values.push(["helix"]);
                        fillObj.check_keys.push("dom_itype");
                        fillObj.check_values.push([parseInt(color_number)]);
                    } else if (color_rule_type === "Loop:") {
                        fillObj.check_keys.push("type");
                        fillObj.check_values.push(["loop"]);
                        fillObj.check_keys.push("dom_itype");
                        fillObj.check_values.push([parseInt(color_number)]);
                    } else if (color_rule_type === "Id:") {
                        fillObj.check_keys.push("id");
                        fillObj.check_values.push([parseInt(color_number)]);
                    } else if (Object.keys(one_to_three).indexOf(color_rule_type) > -1) {
                        fillObj.check_keys.push("res_ind");
                        fillObj.check_values.push([parseInt(color_number)]);
                        fillObj.check_keys.push("res_1");
                        fillObj.check_values.push([color_rule_type]);
                    } else if (Object.keys(three_to_one).indexOf(color_rule_type) > -1) {
                        fillObj.check_keys.push("res_ind");
                        fillObj.check_values.push([parseInt(color_number)]);
                        fillObj.check_keys.push("res_3");
                        fillObj.check_values.push([color_rule_type]);
                    } else if (color_rule_type === "") {
                        fillObj.check_keys.push("res_ind");
                        fillObj.check_values.push([parseInt(color_number)]);
                    }
                } else if (color_rule.includes("Domain:")) {
                    fillObj.check_keys.push("dom_name");
                    fillObj.check_values.push([color_rule.split("Domain:")[1]]);
                } else if (Object.keys(one_to_three).indexOf(color_rule) > -1)  {
                    fillObj.check_keys.push("res_1");
                    fillObj.check_values.push([color_rule]);
                } else if (Object.keys(three_to_one).indexOf(color_rule) > -1) {
                    fillObj.check_keys.push("res_3");
                    fillObj.check_values.push([color_rule]);
                } else if (color_rule === "ALL") {
                    fillObj.check_keys.push("res_3");
                    fillObj.check_values.push(deepCopy(Object.keys(three_to_one)));
                }
            }
            let color_to_map = selection_text.split(",")[1];
            if (color_to_map.includes("by:")) {
                fillObj.get = color_to_map.split("by:")[1];
                fillObj.range = selection_text.split(",")[2].split(";");
                fillObj.domain = selection_text.split(",")[3].split(";");
            } else {
                fillObj.color = color_to_map;
            }
            fillRules.push(fillObj);
        }
    }

    /**
     * Plots membrane as a rectangle
     * @param {Object} data draw area Object merged to style_obj for drawing membrane
     * @param {String} dataId membrane main g element id attribute 
     * @namespace
     * @exports NaView
     * @name draw_membrane_box
     */
    function draw_membrane_box(data, dataId) {
        let svg_element = d3.select("#"+svg_id)
            .append("g")
            .attr("class", "membrane_group")
            .append("rect")
            .attr("x", data["start_x"])
            .attr("y", data["start_y"])
            .attr("width", data["width"])
            .attr("height", data["height"])
            .attr("fill", data["fill"])
            .attr("opacity", data["opacity"])
            ;
        if (dataId) {
            svg_element.attr("id", dataId);
        }
    }

    /**
     * Generates lipid head related data for drawing ellipses representing the membrane bilayer lipids head grouś
     * @param {number} number_of_lipids total number of lipids to be drawn on a single membrane layer 
     * @param {number} shead_x starting x coordinate of a lipid
     * @param {number} head_y1  starting y coordinate of a lipid in the top bilayer
     * @param {number} head_y2  starting y coordinate of a lipid in the bottom bilayer
     * @param {String} head_fill color of each lipid head
     * @param {number} head_opacity opacity of each lipid head
     * @param {String} head_stroke  stroke color of each lipid head
     * @param {String} head_stroke_s stroke width (px) of each lipid head
     * @param {number} lip_rad lipid head ellipse radii 1
     * @param {number} lip_rad_y  lipid head ellipse radii 1
     * @namespace
     * @exports NaView
     * @name gen_lipid_head_data
     * @yields {Array} list of plot related data for generating lipid head ellipse drawings
     */
    function gen_lipid_head_data(number_of_lipids, shead_x, head_y1, head_y2, head_fill, head_opacity,head_stroke,head_stroke_s,lip_rad,lip_rad_y) {
        let head_array = [];
        for (let lip = 0; lip < number_of_lipids; lip++) {
            let head_x = (lip*lip_rad*2) + shead_x;
            let head_obj1 = {
                "cx": head_x,
                "cy": head_y1,//+lip_rad_y,
                "r": lip_rad,
                "rx": lip_rad,
                "ry": lip_rad_y,
                // "ry": lip_rad,
                // "ry": lip_rad*(svg_height/svg_width),
                "fill": head_fill,
                "opacity": head_opacity,
                "stroke": head_stroke,
                "stroke_size": head_stroke_s,
                "type": "upper"
            };
            let head_obj2 = {
                "cx": head_x,
                "cy": head_y2,//-lip_rad_y,
                "r": lip_rad,
                "rx": lip_rad,
                "ry": lip_rad_y,
                // "ry": lip_rad,
                // "ry": lip_rad*(svg_height/svg_width),
                "fill": head_fill,
                "opacity": head_opacity,
                "stroke": head_stroke,
                "stroke_size": head_stroke_s,
                "type": "lower"
            };
            head_array.push(head_obj1);
            head_array.push(head_obj2);
        }
        return head_array;
    }

    /**
     * Calculates the y coordinate of a point in the surface of a sphere.
     * This is done given:<br>
     * the x coordinates<br>
     * the ellipse center coordinates <br>
     * the ellipse radii <br>
     * @param {number} gx x coordinate of point at ellipse surface
     * @param {number} cx x coordinate of ellipse center
     * @param {number} cy y coordinate of ellipse center
     * @param {number} rx ellipse radii 1
     * @param {number} ry ellipse radii 2
     * @namespace
     * @exports NaView
     * @name ellipsis_equation_y
     * @yields {number} y coordinate of a point in the surface of a sphere.
     */
    function ellipsis_equation_y(gx, cx, cy, rx, ry) {
        return (Math.sqrt((1 - Math.pow((gx-cx),2)/Math.pow(rx,2)) * Math.pow(ry,2)))+cy;
    }

    /**
     * Generate lipid tail paths data by calculating tail start and end points.<br>
     * For double lipid tails, it is necessary to find the y coordinates of a point in the surface
     * of the lipid heads ellipse elements.
     * @see ellipsis_equation_y
     * @param {Array} head_data list of plot related data for generating lipid head ellipse drawings
     * @param {number} lipid_tail_number  total number of lipids to be drawn on a single membrane layer 
     * @param {number} lipid_break_num  total number of lipid breaks (not implemented)
     * @param {number} tail_max_length lipid tail total length (px)
     * @param {number} tail_head_dist (deprecated)
     * @param {String} tail_fill color of lipid tail fill
     * @param {number} tail_opacity opacity of lipid tail
     * @param {String} tail_stroke stroke color of lipid tail
     * @param {String} tail_stroke_s stroke size (px) of lipid tail
     * @namespace
     * @exports NaView
     * @name gen_lipid_tail_data
     * @yields {Array} list of plot related data for generating lipid tail path drawings
     */
    function gen_lipid_tail_data(head_data, lipid_tail_number, lipid_break_num, tail_max_length, tail_head_dist,tail_fill,tail_opacity,tail_stroke,tail_stroke_s) {
        let lipid_data = [];
        for (let ihd = 0; ihd < head_data.length; ihd++) {
            let h_data = head_data[ihd];
            let lipid_objs = [];
            if (lipid_tail_number === 1) {
                //add one lipid tail
                let lipid_line = {
                    "fill": tail_fill,
                    "opacity": tail_opacity,
                    "stroke": tail_stroke,
                    "stroke_size": tail_stroke_s,
                    "coords": [
                        [h_data.cx,h_data.cy+h_data.ry]
                    ],
                }
                lipid_objs.push(lipid_line);
            } else {
                let one_third_x = h_data.cx-h_data.rx + (h_data.rx/1.8);
                let two_thirds_x = h_data.cx+h_data.rx-(h_data.rx/1.8);

                let other_y = ellipsis_equation_y(one_third_x, h_data.cx, h_data.cy, h_data.rx, h_data.ry);
                // let other_y = h_data.cy;
                // other_y += (tail_stroke_s)/2;
                // other_y += (h_data.stroke_size);
                // other_y += Math.sqrt(h_data.stroke_size);

                //add two lipid tails
                let lipid_line1 = {
                    "fill": tail_fill,
                    "opacity": tail_opacity,
                    "stroke": tail_stroke,
                    "stroke_size": tail_stroke_s,
                    "coords": [
                        [one_third_x,other_y]
                    ],
                }
                lipid_objs.push(lipid_line1);
                let lipid_line2 = {
                    "fill": tail_fill,
                    "opacity": tail_opacity,
                    "stroke": tail_stroke,
                    "stroke_size": tail_stroke_s,
                    "coords": [
                        [two_thirds_x,other_y]
                    ],
                }
                lipid_objs.push(lipid_line2);
            }
            if (lipid_break_num > 1) {
                let prevy = 0;
                let defy = tail_max_length/lipid_break_num;
                for (let ilo = 0; ilo < lipid_objs.length; ilo++) {
                    //TODO
                    //calculate breaks for each lipid tail
                    //for each break, move forward xperc then backward x perc
                    // lipid_objs[ilo];
                    return;
                }
            } else {
                let prevy = 0;
                let defy = tail_max_length;
                if (h_data.type === "lower") {
                    prevy = ((h_data.ry*2)-h_data.stroke_size) * -1;
                    defy = tail_max_length * -1;
                }
                for (let ilo = 0; ilo < lipid_objs.length; ilo++) {
                    let prev_coord = lipid_objs[ilo].coords[lipid_objs[ilo].coords.length-1];
                    prev_coord[1] += prevy;
                    lipid_objs[ilo].coords.push(
                        [prev_coord[0],prev_coord[1]+defy]
                    );
                }
            }
            //extend lipid_data with each lipid tail line obj;
            lipid_data.push(...lipid_objs);
        }
        return lipid_data;
    }

    /**
     * Plots membrane as a lipid bilayer
     * @see gen_lipid_head_data
     * @see gen_lipid_tail_data
     * @param {Object} data data object for membrane draw area object merged to style_obj definitions
     * @param {String} dataId membrane main g element id attribute 
     * @param {number} tail_head_dist deprecated: height ratio between head and tail groups
     * @namespace
     * @exports NaView
     * @name draw_membrane_lipid
     */
    function draw_membrane_lipid(data, dataId, tail_head_dist) {

        let lipid_head_radius_width = data["lipid_head_radius_width"] * svg_width;
        let ratio_wh = svg_height/svg_width;
        let lipid_head_radius_height = lipid_head_radius_width * ratio_wh * 2;

        let number_of_lipids = data["width"] / (lipid_head_radius_width*2);
        
        let shead_x = data["start_x"] + (lipid_head_radius_width/2);
        let head_y = data["start_y"] + (lipid_head_radius_height);
        let head_y2 = data["end_y"] - (lipid_head_radius_height);

        let head_fill = data["hfill"];
        let head_stroke = data["hstroke"];
        let head_stroke_s = data["hstroke_s"];
        let head_opacity = data["hopacity"];

        let head_data = gen_lipid_head_data(number_of_lipids, shead_x, head_y, head_y2, head_fill, head_opacity,head_stroke,head_stroke_s, lipid_head_radius_width, lipid_head_radius_height);

        let membrane_mid_point = svg_drawarea["height"];
        let tail_max_length = svg_drawarea["membrane_height"]/2 - ((lipid_head_radius_height*2) + (svg_height * data["lipid_tail_spacing"]) );
        if (!tail_head_dist) {
            tail_head_dist = 0.1;
        }
        let tail_fill = data["tfill"];
        let tail_opacity = data["topacity"];
        let tail_stroke = data["tstroke"];
        let tail_stroke_s = data["tstroke_s"];
        let tail_data = gen_lipid_tail_data(head_data, data["lipid_tail_number"], data["lipid_tail_breaks"], tail_max_length, tail_head_dist, tail_fill, tail_opacity,tail_stroke,tail_stroke_s);

        //draw membrane heads
        let membrane_group = d3.select("#"+svg_id)
        .append("g")
        .attr("class", "membrane_group");

        membrane_group.append("g").attr("class","membrane_heads")
        .selectAll(".lipid_heads")
        .data(head_data)
        .join(
            function(enter) {
                return enter
                    .append("ellipse")
                    .attr("class", "lipid_heads")
                    .attr("cx",function(d){
                        return d.cx;
                    })
                    .attr("cy", function(d){
                        return d.cy;
                    })
                    .attr("rx", function(d) { return d.rx;})
                    .attr("ry", function(d) { return d.ry;})
                    .attr("fill", function(d) { return d.fill;})
                    .attr("stroke", function(d) { return d.stroke;})
                    .attr("stroke-width", function(d) { return d.stroke_size;})
                    .attr("opacity", function(d) { return d.opacity;})
                    ;
            },
            function(exit) {
                return exit.remove();
            }
        );

        let tail_lines = d3.line();

        membrane_group.append("g").attr("class","membrane_tails")
        .selectAll(".lipid_tails")
        .data(tail_data)
        .join(
            function(enter) {
                return enter
                    .append("path")
                    .attr("class", "lipid_tails")
                    .attr("d", function(d){
                        return tail_lines(d.coords);
                    })
                    .attr("fill", function(d) { return d.fill;})
                    .attr("stroke", function(d) { return d.stroke;})
                    .attr("stroke-width", function(d) { return d.stroke_size;})
                    .attr("opacity", function(d) { return d.opacity;})
                    ;
            },
            function(exit) {
                return exit.remove();
            }
        );
    }

    /**
     * Draws membrane object as either a single rectangle (mode box) or as a lipid bilayer
     * @see draw_membrane_box
     * @see draw_membrane_lipid
     * @param {Object} data data object for membrane draw area object merged to style_obj definitions
     * @namespace
     * @exports NaView
     * @name draw_membrane
     */
    function draw_membrane(data) {
        //membrane can be box or lipid
        if (style_obj.membrane.membrane_mode === "box") {
            draw_membrane_box(data, "membrane");
            // draw_membrane_box(data, "membrane", "membrane");
        } else if (style_obj.membrane.membrane_mode === "lipid") {
            // draw_membrane_lipid(data, "membrane", "membrane");
            draw_membrane_lipid(data, "membrane");
        }
    }

    /**
     * Merges data from the user defined style_obj draw_opts to the current residue/element selection
     * @param {String} mergeType element name in the style_obj ("element_name"+draw_opts)
     * @param {Array} data data array for a given element (helices, pores, intra or inter domain loops)
     * @yields {Array} data array for a given element with user defined style_obj draw_opts definitions
     * @namespace
     * @exports NaView
     * @name mergeDrawData
     */
    function mergeDrawData(mergeType, data) {
        let drawKey = mergeType+"_draw_opts";
        let drawDict = style_obj["protein"][drawKey];
        let properties = Object.keys(drawDict);
        if (drawDict.type === "dicts") {
            for (let id = 0; id < data.length; id++) {
                for (let ip = 0; ip < properties.length; ip++) {
                    let prop = properties[ip];
                    let to_draw = drawDict[prop];
                    if (to_draw.type === "domain_and_name") {
                        let dom = data[id].dom_name;
                        let itypen = data[id].dom_itype;
                        data[id][prop] = to_draw[dom][itypen];
                    } else if (to_draw.type === "domain") {
                        let dom = data[id].dom_name;
                        data[id][prop] = to_draw[dom];
                    } else if (to_draw.type === "name") {
                        let itypen = data[id].dom_itype;
                        data[id][prop] = to_draw[itypen];
                    }
                }
            }
        } else if (drawDict.type === "single") {
            for (let id = 0; id < data.length; id++) {
                for (let ip = 0; ip < properties.length; ip++) {
                    let prop = properties[ip];
                    if (prop !== "type") {
                        data[id][prop] = drawDict[prop];
                    }
                }
            }
        }
        return data;
    }
    
    /**
     * Builds data for each residue for a given element specific (helices, pores, intra or inter domain loops) data array
     * @param {Array} data data array for a given element (helices, pores, intra or inter domain loops)
     * @yields {Array} element specific data array with per residue information now appended
     * @namespace
     * @exports NaView
     * @name createResidData
     */
    function createResidData(data) {
        for (let id = 0; id < data.length; id++) {
            data[id].resids = [];
            let resids = data[id].aas.split("");
            let resid_index = data[id].start;
            for (let ir = 0; ir < resids.length; ir++) {
                resid_obj = {
                    "res_1": resids[ir],
                    "res_3": one_to_three[resids[ir]],
                    "res_ind": resid_index,
                }
                data[id].resids.push(resid_obj);
                resid_index += 1;
            }
        }
        return data;
    }    

    /**
     * Calculates helix residue ordering based on loops intracellular or extracellular positioning
     * @param {Array} helices_data helices data generated from processRawUniProt
     * @param {Array} all_loop_data all loop data generated from processRawUniProt
     * @namespace
     * @exports NaView
     * @name calculateResidOrientation 
     * @yields {Array} helices data generated from processRawUniProt with additional residue orientation variable
     */
    function calculateResidOrientation(helices_data, all_loop_data) {
        let all_loop_data_by_domain_position = all_loop_data.reduce( (reduce_dict, a) => {
            reduce_dict[a.id] = a;
            return reduce_dict;
        }, {});
        for (let ihd = 0; ihd < helices_data.length; ihd++) {
            let previous_loop = all_loop_data_by_domain_position[helices_data[ihd].id-1];
            if (previous_loop.note === "Cytoplasmic") {
                helices_data[ihd].inverted = true;
            } else {
                helices_data[ihd].inverted = false;
            }
        }
        return helices_data;
    }

    /**
     * Calculates centroid points of each residue and loop/helix elements in plot and stores it in global variable
     * @namespace
     * @exports NaView
     * @name createResidElementToCentroidData 
     */
    function createResidElementToCentroidData() {
        let residueCentroidDict = {};
        let all_residue_paths = d3.selectAll(".single_residue_path");
        let done_resind = [];
        all_residue_paths.each(function(d) {
            let resname = d3.select(this).attr("resname");
            let res_ind = d.res_ind;
            if (done_resind.indexOf(d.res_ind) === -1) {
                done_resind.push(d.res_ind);
            }
            if (residueCentroidDict.hasOwnProperty(res_ind)) {
                residueCentroidDict[res_ind]["path_data"].push(deepCopy(d));
                let old_centroid = deepCopy(residueCentroidDict[res_ind]["point"]);
                residueCentroidDict[res_ind]["point"] = [
                    (old_centroid[0]+d.centroid[0])/2,
                    (old_centroid[1]+d.centroid[1])/2,
                ];
            } else {
                let to_dict_obj = {
                    "res_ind": res_ind,
                    "resname": resname,
                    "path_data": [deepCopy(d)],
                    "point": d.centroid,
                }
                to_dict_obj = mergeDrawData("residue_centroid", [to_dict_obj])[0];
                for (const ky in d) {
                    if (d.hasOwnProperty(ky) && to_dict_obj.hasOwnProperty(ky) === false) {
                        to_dict_obj[ky] = d[ky];
                    }
                }
                residueCentroidDict[res_ind] = to_dict_obj;
            }
        });
        let all_element_paths = d3.selectAll(".element_path_group");
        all_element_paths.each(function(d) {
            let elname;
            let element_centroid;
            if (d.type === "helix") {
                elname = "Domain" +d.dom_name+";Helix"+d.dom_itype;
                let helix_bbox = this.getBBox();
                element_centroid = [helix_bbox.x + (helix_bbox.width)/2, helix_bbox.y + (helix_bbox.height)/2];
            } else if (d.type === "pore") {
                elname = "Domain" +d.dom_name+";Pore";
                let pathg_bbox = this.getBBox();
                let path_half_length = d3.select(this).select("path").node().getTotalLength() * 0.5;
                let center_of_path = d3.select(this).select("path").node().getPointAtLength(path_half_length);
                element_centroid = [center_of_path.x, center_of_path.y];
                let y_deviation = pathg_bbox.height * 0.4;
                // let y_deviation = viewport_height * 0.05;
                if (pathg_bbox.y > (svg_height/2)) {
                    y_deviation *= -1.0;
                }
                element_centroid[1] += y_deviation;
            } else if (d.type === "loop" && d.dom_name) {
                elname = "Domain" +d.dom_name+";Loop"+d.dom_itype;
                let pathg_bbox = this.getBBox();
                let path_half_length = d3.select(this).select("path").node().getTotalLength() * 0.5;
                let center_of_path = d3.select(this).select("path").node().getPointAtLength(path_half_length);
                element_centroid = [center_of_path.x, center_of_path.y];
                let y_deviation = pathg_bbox.height * 0.4;
                // let y_deviation = viewport_height * 0.05;
                if (pathg_bbox.y > (svg_height/2)) {
                    y_deviation *= -1.0;
                }
                element_centroid[1] += y_deviation;
            } else {
                elname = "InterDomain" +d.dom_iname+";Loop";
                let pathg_bbox = this.getBBox();
                let path_half_length = d3.select(this).select("path").node().getTotalLength() * 0.5;
                let center_of_path = d3.select(this).select("path").node().getPointAtLength(path_half_length);
                element_centroid = [center_of_path.x, center_of_path.y];
                let y_deviation = pathg_bbox.height * 0.4;
                // let y_deviation = viewport_height * 0.05;
                if (pathg_bbox.y > (svg_height/2)) {
                    y_deviation *= -1.0;
                }
                element_centroid[1] += y_deviation;
            }
            // console.log(elname);
            let to_dict_obj = {
                "el_ind": d.id,
                "elname": elname,
                "path_data": [deepCopy(d)],
                "point": element_centroid,
            }
            let new_to_dict_obj = mergeDrawData("residue_centroid", [to_dict_obj])[0];
            new_to_dict_obj["circle_radius"] = "5px";
            residueCentroidDict[elname] = new_to_dict_obj;
        });
        // DONE: calculate each path element (helix_group, loop path, etc) centroid and anchor pts
        // for helices it is center of membrane
        // for loop it is point at 0.5 length of loop -/+ perc of height for y (right below)
        // console.log("residueCentroidDict");
        // console.log(residueCentroidDict);
        // plotDotsCircles(Object.values(residueCentroidDict), "residue_centroids", "residue_centroids_circles");
        return residueCentroidDict;
    }

    /**
     * Calculate short loop x,y anchors of element based on previously drawn elements
     * @namespace
     * @exports NaView
     * @name gen_shortloop_anchordata 
     * @param {Array} short_loop_data intradomain short loop data generated from processRawUniProt 
     * @param {Array} helices_pores_data helices and pore loop data generated from processRawUniProt 
     * @yields {Array} intradomain short loop data generated from processRawUniProt with additional x,y helix anchors
     */
    function gen_shortloop_anchordata(short_loop_data, helices_pores_data) {
        let helices_and_pores_by_domain_position = helices_pores_data.reduce( (reduce_dict, a) => {
            reduce_dict[a.dom_name+"_"+a.dom_i] = a;
            return reduce_dict;
        }, {});

        for (let isld = 0; isld < short_loop_data.length; isld++) {
            // const element = array[isld];
            let short_loop_dom_name = short_loop_data[isld].dom_name;
            let short_loop_dom_i = short_loop_data[isld].dom_i;
            let short_loop_side = short_loop_data[isld].note;
            short_loop_data[isld].anchorage = {
                "p1": undefined,
                "p2": undefined
            }
            let previous_element = helices_and_pores_by_domain_position[short_loop_dom_name+"_"+(short_loop_dom_i-1)];
            let next_element = helices_and_pores_by_domain_position[short_loop_dom_name+"_"+(short_loop_dom_i+1)];
            if (previous_element.type === "pore") {
                short_loop_data[isld].anchorage.p1 = [previous_element.draw_area.end_x, previous_element.draw_area.start_y];
            } else {
                if (short_loop_side === "Extracellular") {
                    short_loop_data[isld].anchorage.p1 = previous_element.anchor.top;
                } else  {
                    short_loop_data[isld].anchorage.p1 = previous_element.anchor.bottom;
                }
            }
            if (next_element.type === "pore") {
                short_loop_data[isld].anchorage.p2 = [next_element.draw_area.start_x, previous_element.draw_area.start_y];
            } else {
                if (short_loop_side === "Extracellular") {
                    short_loop_data[isld].anchorage.p2 = next_element.anchor.top;
                } else  {
                    short_loop_data[isld].anchorage.p2 = next_element.anchor.bottom;
                }
            }
            short_loop_data[isld].anchorage.dist = euclideanDistance(short_loop_data[isld].anchorage.p1, short_loop_data[isld].anchorage.p2);
        }
    //     calc_len
    // shape
        return short_loop_data;
    }

    /**
     * Calculate pore loop x,y anchors of element based on previously drawn elements
     * @namespace
     * @exports NaView
     * @name gen_poreloop_anchordata 
     * @param {Array} pores_data pore loop data generated from processRawUniProt 
     * @param {Array} short_loop_data intradomain short loop data generated from processRawUniProt 
     * @yields {Array} intradomain pore loop data generated from processRawUniProt with additional x,y short loop anchors
     */
    function gen_poreloop_anchordata(pores_data, short_loop_data) {
        let short_loop_by_domain_position = short_loop_data.reduce( (reduce_dict, a) => {
            reduce_dict[a.dom_name+"_"+a.dom_i] = a;
            return reduce_dict;
        }, {});

        for (let ipd = 0; ipd < pores_data.length; ipd++) {
            let pore_dom_name = pores_data[ipd].dom_name;
            let pore_dom_i = pores_data[ipd].dom_i;
            let pore_side = pores_data[ipd].note;
            pores_data[ipd].anchorage = {
                "p1": undefined,
                "p2": undefined
            }
            let previous_element = short_loop_by_domain_position[pore_dom_name+"_"+(pore_dom_i-1)];
            let next_element = short_loop_by_domain_position[pore_dom_name+"_"+(pore_dom_i+1)];
            pores_data[ipd].anchorage.p1 = deepCopy(previous_element.anchorage.p2);
            pores_data[ipd].anchorage.p2 = deepCopy(next_element.anchorage.p1);
            pores_data[ipd].anchorage.dist = euclideanDistance(pores_data[ipd].anchorage.p1, pores_data[ipd].anchorage.p2);
        }
        return pores_data;
    }

    /**
     * Calculate interdomain loop x,y anchors of element based on previously drawn elements
     * @namespace
     * @exports NaView
     * @name gen_longloop_anchordata 
     * @param {Array} longloop_data interdomain loop data generated from processRawUniProt 
     * @param {Array} helices_data helices data generated from processRawUniProt 
     * @yields {Array} interdomain long loop data generated from processRawUniProt with additional x,y helix anchors
     */
    function gen_longloop_anchordata(longloop_data, helices_data) {
        let helices_by_domain_position = helices_data.reduce( (reduce_dict, a) => {
            reduce_dict[a.dom_name+"_"+a.dom_i] = a;
            return reduce_dict;
        }, {});

        let last_dom_index_by_name = {};
        for (let ihd = 0; ihd < helices_data.length; ihd++) {
            if (last_dom_index_by_name.hasOwnProperty(helices_data[ihd].dom_name) === false) {
                last_dom_index_by_name[helices_data[ihd].dom_name] = helices_data[ihd].dom_i;
            } else if (helices_data[ihd].dom_i > last_dom_index_by_name[helices_data[ihd].dom_name]) {
                last_dom_index_by_name[helices_data[ihd].dom_name] = helices_data[ihd].dom_i;
            }
        }

        for (let illd = 0; illd < longloop_data.length; illd++) {
            let prev_dom_name = longloop_data[illd].prev_dom_name;
            let next_dom_name = longloop_data[illd].next_dom_name;
            longloop_data[illd].anchorage = {
                "p1": undefined,
                "p2": undefined
            }
            // let previous_element = helices_by_domain_position[prev_dom_name+"_"+1];
            let previous_element = helices_by_domain_position[prev_dom_name+"_"+last_dom_index_by_name[prev_dom_name]];
            // let next_element = helices_by_domain_position[next_dom_name+"_"+last_dom_index_by_name[next_dom_name]];
            let next_element = helices_by_domain_position[next_dom_name+"_"+1];
            longloop_data[illd].anchorage.p1 = previous_element.anchor.bottom;
            longloop_data[illd].anchorage.p2 = next_element.anchor.bottom;
            longloop_data[illd].anchorage.dist = euclideanDistance(longloop_data[illd].anchorage.p1, longloop_data[illd].anchorage.p2);
        }
        return longloop_data;
    }
    
    /**
     * Calculate termini x,y anchors of element based on previously drawn elements
     * @namespace
     * @exports NaView
     * @name gen_termini_anchordata 
     * @param {Object} termini_data termini loop data generated from processRawUniProt 
     * @param {Object} neighboring_helix neighbouring termini helix data generated from processRawUniProt
     * @param {String} termini_type "N" or "C" for N-terminal or C-terminal loop
     * @yields {Object} termini loop data generated from processRawUniProt with additional x,y helix anchors
     */
    function gen_termini_anchordata(termini_data, neighboring_helix, termini_type) {
        let current_point;
        termini_data.terminus_type = termini_type;
        if (termini_type === "N") {
            if (style_obj.protein.nter_loop_draw_opts.calc_len.calc.start_loop === "membrane") {
                current_point = [termini_data.draw_area.start_x,termini_data.draw_area.start_y];
            } else if (style_obj.protein.nter_loop_draw_opts.calc_len.calc.start_loop === "edge") {
                current_point = [termini_data.draw_area.start_x,termini_data.draw_area.end_y];
            }
            termini_data.anchorage = {
                "p1": current_point,
                "p2": neighboring_helix.anchor.bottom,
                "dist": euclideanDistance(current_point, neighboring_helix.anchor.bottom)
            }
        } else {
            // current_point = [termini_data.draw_area.end_x,termini_data.draw_area.end_y];
            if (style_obj.protein.cter_loop_draw_opts.calc_len.calc.start_loop === "membrane") {
                current_point = [termini_data.draw_area.end_x,termini_data.draw_area.start_y];
            } else if (style_obj.protein.cter_loop_draw_opts.calc_len.calc.start_loop === "edge") {
                current_point = [termini_data.draw_area.end_x,termini_data.draw_area.end_y];
            }
            termini_data.anchorage = {
                "p1": neighboring_helix.anchor.bottom,
                "p2": current_point,
                "dist": euclideanDistance(current_point, neighboring_helix.anchor.bottom)
            }
        }
        return termini_data;
    }


    /**
     * Generates a d3.scaleLinear color scale from user inputted color filling rules that use a
     * ",by:property,domain,range" syntax.
     * @see createFillRules
     * @param {String} fillproperty residue property name to map color scale to
     * @param {Array} fillrange fill scale linear color range
     * @param {Array} filldomain fill scale linear color domain. "min" and "max" strings are properly parsed
     * @yields {Function} d3.scaleLinear for a color scale of the desired range and domain
     * @namespace
     * @exports NaView
     * @name createFillScale 
     */
    function createFillScale(fillproperty, fillrange, filldomain) {
        let prop_values = [];
        let scale_min = filldomain[0];
        if ((scale_min+"").includes("min")) {
            let min_res = d3.min(Object.keys(current_resid_properties));
            let max_res = d3.min(Object.keys(current_resid_properties));
            for (let i_res = min_res; i_res < max_res+1; i_res++) {
                let prop_value = current_resid_properties[i_res][fillproperty];
                prop_values.push(prop_value);
            }
            scale_min = d3.min(prop_values);
        }
        filldomain[0] = scale_min;
        let scale_max = filldomain[filldomain.length-1];
        if ((scale_max+"").includes("max")) {
            if (prop_values.length === 0) {
                let min_res = d3.min(Object.keys(current_resid_properties));
                let max_res = d3.min(Object.keys(current_resid_properties));
                for (let i_res = min_res; i_res < max_res+1; i_res++) {
                    let prop_value = current_resid_properties[i_res][fillproperty];
                    prop_values.push(prop_value);
                }
            }
            scale_max = d3.max(prop_values);
        }
        filldomain[filldomain.length-1] = scale_max;
        return d3.scaleLinear()
        .domain(deepCopy(filldomain))
        .range(deepCopy(fillrange));
    }
    
    /**
     * Parses fillRules global object checking if object meets any rule criteria.<br>
     * If so, the appropriate color/color scale is then returned.
     * @param {String} data_obj Helix/pore/loop element current datum
     * @yields false or a rgb/hex/named color. opacity check currently deprecated
     * @namespace
     * @exports NaView
     * @name checkFillResidue 
     */
    function checkFillResidue(data_obj) {
        let this_residue_color = false;
        let get_value = false;
        for (let each_rule_index = 0; each_rule_index < fillRules.length; each_rule_index++) {
            let current_rule = fillRules[each_rule_index];
            let fillproperty = current_rule.get;
            let fillrange = current_rule.range;
            let filldomain = current_rule.domain;
            let colorFunction;
            if (current_rule.get) {
                colorFunction = createFillScale(fillproperty, fillrange, filldomain);
                get_value = current_resid_properties[data_obj.res_ind][fillproperty];
            } else {
                colorFunction = function(etc) {
                    return current_rule.color;
                };
            }
            let current_rule_keys_to_check = current_rule.check_keys;
            let color_this_residue = false;
            for (let check_key_index = 0; check_key_index < current_rule_keys_to_check.length; check_key_index++) {
                let check_key = current_rule_keys_to_check[check_key_index];
                let check_values = current_rule.check_values[check_key_index];
                if ( check_values.indexOf(data_obj[check_key]) > -1) {
                    color_this_residue = true;
                } else  {
                    color_this_residue = false;
                    break;
                }
            }
            if (color_this_residue) {
                this_residue_color = colorFunction(get_value);
            }
        }
        return [this_residue_color, false]; //color, opacity
    }

    /**
     * Creates single rectangle SVG elements for each residue of a rectangle helix.
     * @param {D3 Selection} enter_element d3 selection element containing drawn plot helices
     * @namespace
     * @exports NaView
     * @name draw_helices_resids_box 
     */
    function draw_helices_resids_box(enter_element) {
        let g_helix_resids = enter_element.append("g")
        .attr("id", function(d){
            return "g_helix_resids_" + d.dom_name + "_" + d.dom_itype
        })
        .attr("class", "g_helix_resids residue_path")
        // .style("display", "none")
        .style("visibility", "hidden");
    
        g_helix_resids.selectAll(+function(pd) {
            return ".helices_rect_" + pd.dom_name + "_" + pd.dom_itype;
        })
        .data(function(pd) {
            let aa_array = pd.aas.split('');
            let aa_indarray = rangeArray(pd.aas.length, pd.start);
            if (pd.inverted) {
                aa_array.reverse();
                aa_indarray.reverse();
            }
            let height_per_aa = pd.draw_area.height / aa_array.length;
            let d_data = [];
            for (let iaaa = 0; iaaa < aa_array.length; iaaa++) {
                let aa1 = aa_array[iaaa];
                let aa3 = one_to_three[aa_array[iaaa]];
                let aai = aa_indarray[iaaa];
                let start_x1 = pd.draw_area.start_x;
                let start_y1 = pd.draw_area.start_y + (height_per_aa*iaaa);
                let width1 = pd.draw_area.width;
                let height1 = height_per_aa;
                d_data.push({
                    "id":pd.id,
                    "type":pd.type,
                    "dom_name":pd.dom_name,
                    "dom_itype":pd.dom_itype,
                    "start_x": start_x1,
                    "start_y": start_y1,
                    "width": width1,
                    "height": height1,
                    "fill":pd.fill,
                    "stroke":pd.fill,
                    "stroke_width":pd.stroke_width,
                    "opacity":pd.opacity,
                    "res_1":aa1,
                    "res_3":aa3,
                    "res_ind":aai,
                    "centroid":[
                        (start_x1+width1)/2,
                        (start_y1+height1)/2,
                    ],
                })
            }
            return d_data;
        })
        .join(
            function(enter) {
                return enter.append("rect")
                .attr("class", function(d) { return "helices_rect_" + d.dom_name + "_" + d.dom_itype + " single_residue_path"; })
                .attr("resname", function(d){ return d.res_3+d.res_ind; })
                .attr("x", function(d) { return d["start_x"];} )
                .attr("y", function(d) { return d["start_y"];} )
                .attr("width", function(d) { return d["width"];} )
                .attr("height", function(d) { return d["height"];} )
                .attr("fill", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    let o_color = checkFillResidue(d)[1];
                    if (o_color) {
                        return o_color;;
                    }
                    return d["opacity"];
                })
                .attr("stroke", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d.stroke;
                })
                .attr("stroke-width", function(d) { return d.stroke_size;})
                ;
            },
            function(update) {
                return update
                .transition()
                .attr("fill", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    let o_color = checkFillResidue(d)[1];
                    if (o_color) {
                        return o_color;;
                    }
                    return d["opacity"];
                })
                .attr("stroke", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d.stroke;
                });
            },
            function(exit) {
                return exit.remove();
            }
        );
    }
    
    /**
     * Plots Helices in Box mode (rectangles).
     * @param {Array} data  helices data generated from processRawUniProt function
     * @param {String} dataId helices main g element id attribute 
     * @namespace
     * @exports NaView
     * @name draw_helices_box 
     */
    function draw_helices_box(data, dataId) {
        let svg_element = d3.select("#"+svg_id)
            .append("g")
            .attr("class", "helices_group");
        
        svg_element.selectAll(".helices_rect")
            .data(data)
            .join(
                function(enter) {
                    let e = enter.append("g")
                        .attr("id", function(d){ return "g_helix_" + d.dom_name + "_" + d.dom_itype})
                        .attr("class", "element_path_group");
    
                    e.append("rect")
                        .attr("class", "helices_rect element_path")
                        .attr("x", function(d) { return d["draw_area"]["start_x"];} )
                        .attr("y", function(d) { return d["draw_area"]["start_y"];} )
                        .attr("width", function(d) { return d["draw_area"]["width"];} )
                        .attr("height", function(d) { return d["draw_area"]["height"];} )
                        .attr("fill", function(d) { return d["fill"];} )
                        .attr("opacity", function(d) { return d["opacity"];} )
                        .attr("stroke", function(d) { return d.stroke;})
                        .attr("stroke-width", function(d) { return d.stroke_size;})
                        ;
    
                    draw_helices_resids_box(e);
    
                    return e;
                },
                function(exit) {
                    return exit.remove();
                }
            );
        if (dataId) {
            svg_element.attr("id", dataId);
        }
    }

    /**
     * Creates single rectangle SVG elements for each residue of cylinder helix.
     * @param {D3 Selection} enter_element d3 selection element containing drawn plot helices
     * @namespace
     * @exports NaView
     * @name draw_helices_resids_cylinder 
     */
    function draw_helices_resids_cylinder(enter_element) {
        let g_helix_resids = enter_element.append("g")
        .attr("id", function(d){ return "g_helix_resids_" + d.dom_name + "_" + d.dom_itype})
        .attr("class", "g_helix_resids residue_path")
        // .style("display", "none")
        .style("visibility", "hidden");
        
        g_helix_resids.selectAll(+function(d) {
            return ".helices_cylinders_" + d.dom_name + "_" + d.dom_itype;
        })
        .data(function(d) {
            let aa_array = d.aas.split('');
            // let aa_array = data.aas.split('');
            let aa_indarray = rangeArray(d.aas.length, d.start);
            if (d.inverted) {
                aa_array.reverse();
                aa_indarray.reverse();
            }
    
            let height_per_aa = d.draw_area.height / aa_array.length;
            let d_data = [];
            for (let iaaa = 0; iaaa < aa_array.length; iaaa++) {
                let aa1 = aa_array[iaaa];
                let aa3 = one_to_three[aa_array[iaaa]];
                let aai = aa_indarray[iaaa];
                let start_x1 = d.draw_area.start_x;
                let start_y1 = d.draw_area.start_y + (height_per_aa*iaaa);
                let width1 = d.draw_area.width;
                let height1 = height_per_aa;
                d_data.push({
                    "id":d.id,
                    "type":d.type,
                    "dom_name":d.dom_name,
                    "dom_itype":d.dom_itype,
                    "start_x": start_x1,
                    "start_y": start_y1,
                    "width": width1,
                    "height": height1,
                    "fill":d.fill,
                    "stroke":d.fill,
                    "stroke_width":d.stroke_width,
                    "opacity":d.opacity,
                    "res_1":aa1,
                    "res_3":aa3,
                    "res_ind":aai,
                    "centroid":[
                        (start_x1+width1)/2,
                        (start_y1+height1)/2,
                    ],
                })
            }
            return d_data;
        })
        .join(
            function(enter) {
                return enter.append("rect")
                .attr("class", function(d) { return "helices_rect_" + d.dom_name + "_" + d.dom_itype + " single_residue_path"; })
                .attr("resname", function(d){ return d.res_3+d.res_ind; })
                .attr("x", function(d) { return d["start_x"];} )
                .attr("y", function(d) { return d["start_y"];} )
                .attr("width", function(d) { return d["width"];} )
                .attr("height", function(d) { return d["height"];} )
                .attr("stroke-width", function(d) { return d.stroke_size;})
                .attr("fill", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    let o_color = checkFillResidue(d)[1];
                    if (o_color) {
                        return o_color;;
                    }
                    return d["opacity"];
                })
                .attr("stroke", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d.stroke;
                })
                .attr("stroke-dasharray", function(d,i) {
                    let max_i = g_helix_resids.data().length-1;
                    if (i === max_i) {
                        return (d["width"]+d["height"]) + "," + d["width"];
                    }
                    return;
                })
                .on("mouseover", function(d) {
                    console.log("");
                    console.log("#######");
                    console.log("MOUSE OVER PATH");
                    console.log("data:");
                    console.log(d);
                    console.log("#######");
                    console.log("");
                })
                ;
            },
            function(update) {
                return update
                .transition()
                .attr("fill", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    let o_color = checkFillResidue(d)[1];
                    if (o_color) {
                        return o_color;;
                    }
                    return d["opacity"];
                })
                .attr("stroke", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d.stroke;
                });
            },
        );
    }
    
    /**
     * Plots Helices in Cylinder mode.<br>
     * Cylinder is composed of circle-rectangle-circle
     * @see draw_helices_resids_cylinder
     * @param {Array} data helices data generated from processRawUniProt function
     * @param {String} dataId helices main g element id attribute
     * @namespace
     * @exports NaView
     * @name draw_helices_cylinder 
     */
    function draw_helices_cylinder(data, dataId) {
        let ratio_wh = svg_height/svg_width;
        let cylinder_radius_x = data[0].draw_area.width/2;
        let cylinder_radius_y = cylinder_radius_x * ratio_wh;
        let top_cylinder_stroke = style_obj.protein.helix_draw_opts.draw.top_cylinder_stroke; 
        let top_cylinder_stroke_size = style_obj.protein.helix_draw_opts.draw.top_cylinder_stroke_size; 
        // let top_cylinder_fill = style_obj.protein.helix_draw_opts.draw.top_cylinder_fill;
        let bottom_cylinder_stroke =  style_obj.protein.helix_draw_opts.draw.bottom_cylinder_stroke; 
        let bottom_cylinder_stroke_size = style_obj.protein.helix_draw_opts.draw.bottom_cylinder_stroke_size; 
        // let bottom_cylinder_fill = style_obj.protein.helix_draw_opts.draw.bottom_cylinder_fill;
    
        // let lipid_head_radius_height = lipid_head_radius_width * ratio_wh * 2;
    
        let svg_element = d3.select("#"+svg_id)
            .append("g")
            .attr("class", "helices_group");
        
        svg_element.selectAll(".helices_cylinder")
            .data(data)
            .join(
                function(enter) {
                    let e = enter.append("g")
                        .attr("id", function(d){ return "g_helix_" + d.dom_name + "_" + d.dom_itype})
                        .attr("class", "helices_cylinder element_path_group");
    
                    e.append("ellipse")
                        .attr("class", "helices_cyl_bottom_circle")
                        .attr("cx", function(d) { return d["draw_area"]["start_x"]+cylinder_radius_x;} )
                        .attr("cy", function(d) { return d["draw_area"]["end_y"];} )
                        .attr("rx", cylinder_radius_x )
                        .attr("ry", cylinder_radius_y )
                        .attr("fill", function(d) {
                            let f_color = checkFillResidue(d.resids[d.resids.length-1])[0];
                            if (f_color) {
                                return f_color;
                            }
                            return d["fill"];
                        } )
                        .attr("opacity", function(d) {
                            let o_color = checkFillResidue(d.resids[d.resids.length-1])[1];
                            if (o_color) {
                                return o_color;;
                            }
                            return d["opacity"];
                        })
                        // .attr("fill", function(d) {
                        //     return d["fill"];
                        // } )
                        // .attr("opacity", function(d) { return d["opacity"];} )
                        .attr("stroke", bottom_cylinder_stroke)
                        .attr("stroke-width", bottom_cylinder_stroke_size)
                        ;
                    e.append("rect")
                        .attr("class", "helices_cyl_rect element_path")
                        .attr("x", function(d) { return d["draw_area"]["start_x"];} )
                        .attr("y", function(d) { return d["draw_area"]["start_y"];} )
                        .attr("width", function(d) { return d["draw_area"]["width"];} )
                        .attr("height", function(d) { return d["draw_area"]["height"];} )
                        .attr("fill", function(d) { return d["fill"];} )
                        .attr("opacity", function(d) { return d["opacity"];} )
                        .attr("stroke", function(d) { return d.stroke;})
                        .attr("stroke-width", function(d) { return d.stroke_size;})
                        .attr("stroke-dasharray", function(d) { return d["draw_area"]["width"]+d["draw_area"]["height"]+","+d["draw_area"]["width"];})
                        ;
                    draw_helices_resids_cylinder(e);
                    e.append("ellipse")
                        .attr("class", "helices_cyl_top_circle")
                        .attr("cx", function(d) { return d["draw_area"]["start_x"]+cylinder_radius_x;} )
                        .attr("cy", function(d) { return d["draw_area"]["start_y"];} )
                        .attr("rx", cylinder_radius_x)
                        .attr("ry", cylinder_radius_y )
                        .attr("fill", function(d) {
                            let f_color = checkFillResidue(d.resids[0])[0];
                            if (f_color) {
                                return f_color;
                            }
                            return d["fill"];
                        } )
                        .attr("opacity", function(d) {
                            let o_color = checkFillResidue(d.resids[0])[1];
                            if (o_color) {
                                return o_color;;
                            }
                            return d["opacity"];
                        })
                        // .attr("fill", function(d) {
                            // return d["fill"];
                        // } )
                        // .attr("opacity", function(d) { return d["opacity"];} )
                        .attr("stroke", top_cylinder_stroke)
                        .attr("stroke-width", top_cylinder_stroke_size)
                        ;
                    return e;
                },
                function(update) {
                    let bc = update.select(".helices_cyl_bottom_circle")
                    .transition()
                    .attr("fill", function(d) {
                        let f_color = checkFillResidue(d.resids[d.resids.length-1])[0];
                        if (f_color) {
                            return f_color;
                        }
                        return d["fill"];
                    } )
                    .attr("opacity", function(d) {
                        let o_color = checkFillResidue(d.resids[d.resids.length-1])[1];
                        if (o_color) {
                            return o_color;;
                        }
                        return d["opacity"];
                    })
                    ;
                    let tc = update.select(".helices_cyl_top_circle")
                    .transition()
                    .attr("fill", function(d) {
                        let f_color = checkFillResidue(d.resids[0])[0];
                        if (f_color) {
                            return f_color;
                        }
                        return d["fill"];
                    } )
                    .attr("opacity", function(d) {
                        let o_color = checkFillResidue(d.resids[0])[1];
                        if (o_color) {
                            return o_color;;
                        }
                        return d["opacity"];
                    });
                    return update;
                },
                function(exit) {
                    return exit.remove();
                }
            );
        if (dataId) {
            svg_element.attr("id", dataId);
        }
    }

    /**
     * Constructs Path "d" attribute from a datum element containing a "points" attribute
     * @param {Object} d datum element containing a "points" attribute
     * @namespace
     * @exports NaView
     * @name buildPathStringFromData 
     * @yields {String} Path "d" attribute
     */
    function buildPathStringFromData(d) {
        let cmdarray = ["M"];
        for (let i_todraw = 0; i_todraw < d.points.length; i_todraw++) {
            let points_element = d.points[i_todraw];
            let points_element_type = points_element.type;
            switch (points_element_type) {
                case "curvB":
                    cmdarray.push("C"); //start downward curves
                    for (let icrvD = 0; icrvD < points_element.p.length; icrvD++) {
                        let crvP = points_element.p[icrvD];
                        cmdarray.push(crvP); //downward curves movement
                    }
                    break;
                case "lineP":
                    cmdarray.push("L"); //start downward curves
                    cmdarray.push(points_element.p); //start downward curves
                    break;
                default:
                    cmdarray.push(points_element.p); //start movement
                    break;
            }
        }
        if (d.pathclose === true) {
            cmdarray.push("z"); //finish movement
        }
        var string_d = "";
        for (let icmd = 0; icmd < cmdarray.length-1; icmd++) {
            string_d += cmdarray[icmd] + " ";
        }
        string_d += cmdarray[cmdarray.length-1];
        return string_d;
    }
    
    /**
     * Retrieves points from a D3 Path selection
     * @param {D3 Path Selection} d3path D3 Path selection to get desired points
     * @param {String} searchchar optional path selection. searches for a points refering to a given curve or line
     * @namespace
     * @exports NaView
     * @name pathStringToStringPoints 
     * @yields {Array} Coordinate Array of points for given path
     */
    function pathStringToStringPoints(d3path, searchchar) {
        // var re = new RegExp("a|b");
        let path_string = d3path.attr("d");
        let arrayOfStrings = path_string.split(/(?=[MCL])/g);
        if (searchchar) {
            let results = [];
            for (let i_strarr = 0; i_strarr < arrayOfStrings.length; i_strarr++) {
                let string_el = arrayOfStrings[i_strarr];
                if (string_el.indexOf(searchchar) > -1) {
                    results.push(string_el);
                }
            }
            if (results.length === 1) {
                return results[0];
            }
            return results;
        }
        return arrayOfStrings;
    }

    /**
     * Converts SVG point object to Array of coordinates
     * @param {Object} dot1 point to be converted to Array of coordinates
     * @namespace
     * @exports NaView
     * @name dotToCoords 
     * @yields {Array} Coordinate Array of given point
     */
    function dotToCoords(dot1) {
        let ndot = [];
        if (dot1.x) {
            ndot.push(dot1.x);
        } else {
            ndot.push(dot1[0]);
        }
        if (dot1.y) {
            ndot.push(dot1.y);
        } else {
            ndot.push(dot1[1]);
        }
        return ndot;
    }
    
    /**
     * Generate mid point between two points [x,y]
     * @param {Array} dot1 point 1 to generate mid point
     * @param {Array} dot2 point 2 to generate mid point
     * @namespace
     * @exports NaView
     * @name calculateDotArrayMiddlePoint 
     * @yields {Array} Coordinate Array of Mid Points
     */
    function calculateDotArrayMiddlePoint(dot1, dot2) {
        return [(dot1[0] + dot2[0])/2,(dot1[1] + dot2[1])/2];
    }
    
    /**
     * Generate mid point between two SVG Path points {"x":x,"y":y}
     * @param {Object} dot1 point 1 to generate mid point
     * @param {Object} dot2 point 2 to generate mid point
     * @namespace
     * @exports NaView
     * @name calculateDotMiddlePoint 
     * @yields {Array} Coordinate Array of Mid Points
     */
    function calculateDotMiddlePoint(dot1, dot2) {
        return [(dot1.x + dot2.x)/2,(dot1.y + dot2.y)/2];
    }
    
    /**
     * Generate X mid points equally spaced between two points
     * @param {Object} dot1 point 1 to generate mid points
     * @param {Object} dot2 point 2 to generate mid points
     * @param {number} xmids number of equally spaced mid points
     * @yields {Array} Array of equally spaced X mid points
     * @namespace
     * @exports NaView
     * @name generateXMidPts 
     */
    function generateXMidPts(dot1, dot2, xmids) {
        let dots = [];
        dots.push([dot1.x, dot1.y]);
        let deltaX = (dot2.x - dot1.x)/xmids;
        let deltaY = (dot2.y - dot1.y)/xmids;
        for (let idot = 1; idot <= xmids; idot++) {
            dots.push([(dot1.x+(deltaX*idot)),(dot1.y+(deltaY*idot))]);
        }
        dots.push([dot2.x, dot2.y]);
        return dots;
    }
    
    /**
     * Sample points from a SVG path from a start length to end length
     * @param {HTMLElement} dompath half turn parent path element as DOM Object
     * @param {number} segmentstart start length of sampling
     * @param {number} segmentend end length of sampling
     * @param {number} sampling_step step of sampling
     * @param {number} sampling_stepend final step of sampling
     * @yields {Array} Array of sampled path points
     * @namespace
     * @exports NaView
     * @name pathSegmentToXYPoints 
     */
    function pathSegmentToXYPoints(dompath, segmentstart, segmentend, sampling_step, sampling_stepend) {
        if (!sampling_step) {
            sampling_step = 0.25;
        }
        if (!sampling_stepend) {
            sampling_stepend = sampling_step;
        }
        let segs = [];
        for (var i=segmentstart; i<=segmentend+sampling_stepend; i+=sampling_step) {
        // for (var i=segmentstart; i<segmentend; i+=sampling_step) {
            //length to generate point is translations from i and accumulated previous path points to pieceSize
            let sampled_point = dompath.getPointAtLength(i);
            segs.push([sampled_point.x, sampled_point.y]);
        }
        return segs;
    }
    
    /**
     * Generates drawing information for bezier curves that define each half turn object.<br>
     * This is done according to a helix number of turns (division by three).<br>
     * And also to style_obj helix width and height definitions, as well as to the number of residues in each half turn.<br>
     * @namespace
     * @exports NaView
     * @name gen_helix_cartoon_halfturn_data 
     * @param {Array} data helix data generated by processRawUniProt
     * @yields {Object} Object containing:<br>
     * 1. back and front half turn points to generate half turn paths:<br>
     * 2. Total turn number for a helix<br>
     * 3. Parity of half helix front turn number (deprecated) <br>
     */
    function gen_helix_cartoon_halfturn_data(data) {
        let aanum = data.aanum;
        let helix_drawarea = data.draw_area;
        let helix_hstart = helix_drawarea.start_y;
        let helix_wstart = helix_drawarea.start_x;
        let helixwidth = helix_drawarea.width;
        let helixheight = helix_drawarea.height;
        let resid_inversion = data.inverted;
    
        let aa_array = data.aas.split('');
        let aa_indarray = rangeArray(data.aas.length, data.start);
        if (resid_inversion) {
            aa_array.reverse();
            aa_indarray.reverse();
        }
    
        var end_bck = false;
        var end_frt = false;
        var ends_at = "";
        var number_of_turns_integer = 0;
        var half_turns_number = 0;
        let counter = 0;
        for (let iaa = 0; iaa < aanum; iaa++) {
            if (counter === 0) { //fourth is skip
                number_of_turns_integer += 1;
                half_turns_number += 1;
                ends_at = "back";
                end_bck = true;
                end_frt = false;
                counter += 1;
            } else if (counter === 3) {
                half_turns_number += 1;
                ends_at = "front";
                end_frt = true;
                end_bck = false;
                counter = 0;
            } else {
                counter += 1;
            }
        }
        
        let half_turn_resids = stringToChunksSkip(data.aas, 3, 1);
        let half_turn_resids2 = stringToChunksSkip(data.aas.slice(2), 3, 1);
        // half_turns_number = half_turn_resids.length;
    
        let back_half_turn_resids = half_turn_resids.filter(function(a, i) {
            // return a.length === 3;
            let parity = i % 2 === 0;
            if (end_frt && i === half_turn_resids.length-1) {
                return false;
            }
            return parity;
        });
        let front_half_turn_resids = half_turn_resids2.filter(function(a, i) {
            // return a.length === 3;
            if (end_bck && i === half_turn_resids.length-1) {
                return false;
            }
            return i % 2 === 0;
        });
        half_turns_number = back_half_turn_resids.length + front_half_turn_resids.length;
    
        var height_step_per_full_turn = helixheight / (half_turns_number/2);
        // var height_step_per_full_turn = helixheight / number_of_turns_integer;
        var height_step_per_half_turn = height_step_per_full_turn / 2;
    
        let helix_draw_thickness = style_obj["protein"]["helix_draw_opts"]["draw"]["thickness"];
        var thickness_step_per_half_turn = height_step_per_half_turn * helix_draw_thickness;
    
        var width_step_per_half_turn = helixwidth;
    
        
        let w = width_step_per_half_turn;
        let h = height_step_per_half_turn;
    
        let helix_draw_x_to_end_proportion = style_obj["protein"]["helix_draw_opts"]["draw"]["x_to_end_prop"];
        //let helix_draw_thickness = helix_draw_thickness;
        let helix_draw_y_to_mid_proportion = style_obj["protein"]["helix_draw_opts"]["draw"]["y_to_mid_prop"];
    
        let tx = (w * helix_draw_x_to_end_proportion);
        let ty = (h * helix_draw_thickness); // helix half turn height
        let py = helix_draw_y_to_mid_proportion;
    
        let back_helix_color = data.back_fill;
        let front_helix_color = data.fill;
    
        let helix_stroke_size = style_obj["protein"]["helix_draw_opts"]["draw"]["stroke_size"];
        let back_helix_stroke = style_obj["protein"]["helix_draw_opts"]["draw"]["back_helix_stroke"];
        let front_helix_stroke = style_obj["protein"]["helix_draw_opts"]["draw"]["front_helix_stroke"];
    
        let parsed_resnum = 0;
    
        let helix_bck_resnum = 0;
        var helix_bck_draw_array = [];
    
        let helix_frt_resnum = 0;
        var helix_frt_draw_array = [];
    
        for (let half_turn_i = 0; half_turn_i < half_turns_number; half_turn_i++) {
            var half_turn_oddeven = half_turn_i % 2;
            var x = helix_wstart + (width_step_per_half_turn * half_turn_oddeven);
            var y = helix_hstart + (half_turn_i * height_step_per_half_turn);
            let parts_division;
            if (half_turn_i === 0) {
                parts_division = [2,2,1];
            } else if (half_turn_i === half_turns_number-1) {
                parts_division = [1,2,2];
            } else {
                parts_division = [2,3,2];
            }
            if (half_turn_oddeven == 0) {
                let bckresids = [];
                let bck_resid_data = back_half_turn_resids[helix_bck_resnum].split("");
                let bck_respos_index = (half_turn_i*2);
                for (let ibrd = 0; ibrd < bck_resid_data.length; ibrd++) {
                    let res_1 = bck_resid_data[ibrd];
                    bckresids.push({
                        "id":data.id,
                        "type":data.type,
                        "dom_name":data.dom_name,
                        "dom_itype":data.dom_itype,
                        "res_1":aa_array[bck_respos_index],
                        "res_3":one_to_three[aa_array[bck_respos_index]],
                        // "res_ind": data.start+(bck_respos_index),
                        "res_ind": aa_indarray[bck_respos_index],
                        "opacity": data.opacity,
                        "fill": back_helix_color,
                        "stroke_color": back_helix_stroke,
                        "stroke_size": helix_stroke_size,
                    });
                    // if (aa_array[bck_respos_index] !== res_1) {
                    //     console.log("##############");
                    //     console.log("!!! FATAL ERROR: WRONG RESIDUE");
                    //     console.log("##############");
                    //     return;
                    // }
                    bck_respos_index += 1;
                }
    
                let xend = x+w;
                let y_add = 0;
                if (bckresids.length === 2) {
                    xend = x+((w/3)*2);
                    parts_division = parts_division.slice(0,2);
                } else if (bckresids.length === 1) {
                    xend = x+(w/3);
                    parts_division = parts_division.slice(0,1);
                }
                if (half_turn_i === half_turns_number-1) {
                    y_add = 0;
                }
    
                let yend = y+(h+y_add);
    
                let d = ((h+y_add)-ty) / 2;
    
                let bx1 = x + tx;
                let bx2 = xend  - tx;
                
                let by1 = (y+ty) + ( ((h+y_add)-ty)/2  + ( ((h+y_add)-ty) * py) );
                let by2 = (y+ty) + ( ((h+y_add)-ty)/2  - ( ((h+y_add)-ty) * py) );
    
                let by3 = (yend-ty) - ( ((h+y_add)-ty)/2  + ( ((h+y_add)-ty) * py) );
                let by4 = (yend-ty) - ( ((h+y_add)-ty)/2  - ( ((h+y_add)-ty) * py) );
    
                helix_bck_resnum += 1;
    
                helix_bck_draw_array.push({
                    "id":data.id,
                    "type":data.type,
                    "dom_name":data.dom_name,
                    "dom_itype":data.dom_itype,
                    "resids": bckresids,
                    "pathclose": true,
                    "fill": back_helix_color,
                    "stroke_color": back_helix_stroke,
                    "stroke_size": helix_stroke_size,
                    "parts_division": parts_division,
                    "points":[
                        {"turn_index": half_turn_i,"pathtype": "bck","type": "addP", "p": x + "," + y},
                        {"turn_index": half_turn_i,"pathtype": "bck","type": "addP", "p": x + "," + (y+ty)},
                        {"turn_index": half_turn_i,"pathtype": "bck","type": "curvB", "p":[ bx1+","+by1 ,   bx2+","+by2,   xend+","+yend]},
                        {"turn_index": half_turn_i,"pathtype": "bck","type": "lineP", "p":xend+","+(yend-ty)},
                        {"turn_index": half_turn_i,"pathtype": "bck","type": "curvB", "p":[ bx2+","+by3 ,   bx1+","+by4,   x+","+y]},
                    ]
                });
            }
            else if (half_turn_oddeven == 1) {
                y = helix_hstart + ( (half_turn_i-0.5) * height_step_per_half_turn);
                var y2 = helix_hstart + ( (half_turn_i) * height_step_per_half_turn);
                var y3 = helix_hstart + ( (half_turn_i+0.5) * height_step_per_half_turn);
    
                let frtresids = [];
                let frt_resid_data = front_half_turn_resids[helix_frt_resnum].split("");
                let frt_respos_index = (half_turn_i*2);
                for (let ifrd = 0; ifrd < frt_resid_data.length; ifrd++) {
                    let res_1 = frt_resid_data[ifrd];
                    frtresids.push({
                        "id":data.id,
                        "type":data.type,
                        "dom_name":data.dom_name,
                        "dom_itype":data.dom_itype,
                        "res_1":aa_array[frt_respos_index],
                        "res_3":one_to_three[aa_array[frt_respos_index]],
                        // "res_ind": data.start+(frt_respos_index),
                        "res_ind": aa_indarray[frt_respos_index],
                        "opacity": data.opacity,
                        "fill": front_helix_color,
                        "stroke_color": front_helix_stroke,
                        "stroke_size": helix_stroke_size,
                    });
                    // if (aa_array[frt_respos_index] !== res_1) {
                    //     console.log("##############");
                    //     console.log("!!! FATAL ERROR: WRONG RESIDUE");
                    //     console.log("##############");
                    //     return;
                    // }
                    frt_respos_index += 1;
                }
                let xend = x-w;
                if (frtresids.length === 2) {
                    xend = x-(w/3);
                    parts_division = parts_division.slice(0,2);
                } else if (frtresids.length === 1) {
                    xend = x-((w/3)*2);
                    parts_division = parts_division.slice(0,1);
                }
                if (half_turn_i === half_turns_number-1) {
                    y3 = y2;
                }
    
                let yend = y3+h;
                let yend2 = y2+h;
    
                let d = (h-ty) / 2;
    
                let bx1 = x - tx;
                let bx2 = xend  + tx;
                
                let by1 = (y2+ty) + ( (h-ty)/2  + ( (h-ty) * py) );
                let by2 = (y2+ty) + ( (h-ty)/2  - ( (h-ty) * py) );
    
                let by3 = (yend2-ty) - ( (h-ty)/2  + ( (h-ty) * py) );
                let by4 = (yend2-ty) - ( (h-ty)/2  - ( (h-ty) * py) );
    
                helix_frt_resnum += 1;
                helix_frt_draw_array.push({
                    "id":data.id,
                    "type":data.type,
                    "dom_name":data.dom_name,
                    "dom_itype":data.dom_itype,
                    "resids": frtresids,
                    "pathclose": true,
                    "fill": front_helix_color,
                    "stroke_color": front_helix_stroke,
                    "stroke_size": helix_stroke_size,
                    "parts_division": parts_division,
                    "points":[
                        {"turn_index": half_turn_i, "pathtype":"frt","type": "addP", "p": x + "," + y},
                        {"turn_index": half_turn_i, "pathtype":"frt","type": "addP", "p": x + "," + (y+ty)},
                        {"turn_index": half_turn_i, "pathtype":"frt","type": "curvB", "p":[ bx1+","+by1 ,   bx2+","+by2,   xend+","+yend]},
                        {"turn_index": half_turn_i, "pathtype":"frt","type": "lineP", "p":xend+","+(yend-ty)},
                        {"turn_index": half_turn_i, "pathtype":"frt","type": "curvB", "p":[ bx2+","+by3 ,   bx1+","+by4,   x+","+y]},
                    ]
                });
            }
        }
        let helix_to_draw_data = {
            "back": helix_bck_draw_array,
            "front": helix_frt_draw_array,
            "half_turns_number":half_turns_number,
            "aanum_parity": aanum % 2 === 0,
        }
        return helix_to_draw_data;
    }

    /**
     * Defines boundaries of each residue in parent path half helix polygon for residue partitioning function
     * @namespace
     * @exports NaView
     * @name getHalfHelixBoundaries 
     * @param {HTMLElement} dom_created_path half turn parent path element as DOM Object
     * @param {number} dom_created_path_length total length of half turn parent path element
     * @param {number} height_sline pixel height of each half turn symetrical left and right vertical lines
     * @param {Array} division number of residues and residue proportion in each half turn element
     * @yields {Array} Array of three important objects:<br>
     * 1.bottom "left" and "right" coordinates of half turn parent path element<br>
     * 2.top "left" and "right" coordinates of half turn parent path element<br>
     * 3.proportion of each residue in parent path half helix polygon
     */
    function getHalfHelixBoundaries(dom_created_path, dom_created_path_length, height_sline, division) {
        //and subtract 2 times line height and divide by 2
        let curve_length = (dom_created_path_length - (2*height_sline)) / 2;
        
        let curve_step =  curve_length / 3;
    
        let curve_div_size = curve_length / division.size;
    
        //division.curve_steps indicates proportion of polygons
        let curve_step_size_f = curve_length;
        let curve_step_size_1 = division.curve_steps[0].size * curve_div_size;
        division.curve_steps[0].csize = curve_step_size_1;
        
        curve_step_size_f -= curve_step_size_1;
    
        let curve_step_size_2 = false;
    
        if (division.curve_steps.length === 2) {
            curve_step_size_2 = division.curve_steps[1].size * curve_div_size;
            division.curve_steps[1].csize = curve_step_size_2;
            curve_step_size_f -= curve_step_size_2;
        }
    
        let displacement_ps = curve_step*style_obj["protein"]["helix_draw_opts"]["draw"]["aa_area_perc_displacement"];
        
        let displacement_ps1 = curve_step_size_1*style_obj["protein"]["helix_draw_opts"]["draw"]["aa_area_perc_displacement"];
        let displacement_psf = curve_step_size_f*style_obj["protein"]["helix_draw_opts"]["draw"]["aa_area_perc_displacement"];
        let displacement_ps2 = false;
        if (division.curve_steps.length === 2) {
            displacement_ps2 = curve_step_size_2*style_obj["protein"]["helix_draw_opts"]["draw"]["aa_area_perc_displacement"];
        }
    
        //the use getpointatlength for getting the desired points at each third of path
    
        //division.curve_steps indicates proportion of polygons.
        //first curve start for both back and front half-helices is after going down (left/right) lines
        //first curve "third" should be summed first step, this is clear
    
        let f_curve_start = height_sline;
        let f_curve_fthird = f_curve_start+curve_step_size_1;
        let f_curve_sthird = false;
        if (division.curve_steps.length === 2) {
            //first curve second "third" should be summed second step, this is also clear
            f_curve_sthird = f_curve_start+(curve_step_size_1+curve_step_size_2);
        }
    
        let s_curve_start = ((height_sline*2)+curve_length);
        //now it is a bit unclear. second curve shoudl also be summed first step
        let s_curve_fthird = s_curve_start+curve_step_size_f;
        let s_curve_sthird = false;
        if (division.curve_steps.length === 2) {
            s_curve_sthird = s_curve_start+(curve_step_size_2+curve_step_size_f);
        }
    
        let fp_btm_curve = dom_created_path.getPointAtLength(f_curve_fthird+displacement_ps1);
        let sp_btm_curve = false;
        let fp_top_curve = dom_created_path.getPointAtLength(s_curve_fthird+displacement_psf);
        let sp_top_curve = false;
        if (division.curve_steps.length === 2) {
            sp_btm_curve = dom_created_path.getPointAtLength(f_curve_sthird+displacement_psf);
            sp_top_curve = dom_created_path.getPointAtLength(s_curve_sthird+displacement_ps1);
        }
        
        let default_curve_point = {
            "x":0,
            "y":0,
            "path_len_to_pt":0,
        };
    
        let bottom_curve_points = {
            "left": deepCopy(default_curve_point),
        };
        let top_curve_points = {
            "left": deepCopy(default_curve_point),
        };
        if (division.curve_steps.length === 2) {
            bottom_curve_points["right"] = deepCopy(default_curve_point);
            top_curve_points["right"] = deepCopy(default_curve_point);
        }
        
        bottom_curve_points["left"]["x"] = fp_btm_curve.x;
        bottom_curve_points["left"]["y"] = fp_btm_curve.y;
        bottom_curve_points["left"]["path_len_to_pt"] = f_curve_fthird+displacement_ps;
    
        if (division.curve_steps.length === 2) {
            bottom_curve_points["right"]["x"] = sp_btm_curve.x;
            bottom_curve_points["right"]["y"] = sp_btm_curve.y;
            bottom_curve_points["right"]["path_len_to_pt"] = f_curve_sthird+displacement_ps;
        }
    
        if (division.curve_steps.length === 2) {
            top_curve_points["right"]["x"] = fp_top_curve.x;
            top_curve_points["right"]["y"] = fp_top_curve.y;
            top_curve_points["right"]["path_len_to_pt"] = s_curve_fthird+displacement_ps;
        }
    
        top_curve_points["left"]["x"] = sp_top_curve.x;
        top_curve_points["left"]["y"] = sp_top_curve.y;
        top_curve_points["left"]["path_len_to_pt"] = s_curve_sthird+displacement_ps;
    
        if (division.curve_steps.length === 1) {
            top_curve_points["left"]["x"] = fp_top_curve.x;
            top_curve_points["left"]["y"] = fp_top_curve.y;
            top_curve_points["left"]["path_len_to_pt"] = s_curve_fthird+displacement_ps;
        }
        
        return [bottom_curve_points, top_curve_points, curve_step_size_1, curve_step_size_2];
    }

    /**
     * Calculate Parent Path division points and Plots residue specific path elements for half turns representing a single residue
     * @namespace
     * @exports NaView
     * @name drawSingleHalfHelixResidue 
     * @param {Object} data data object for each half helix turn representing a single residue
     * @param {String} path_class name to generate group element class of new sub paths
     * @param {number} data_index index of half turn parent element
     * @param {HTMLElement} dom_created_path half turn parent path element as DOM Object
     */
    function drawSingleHalfHelixResidue(data, path_class, data_index, dom_created_path) {
        let d3_created_path_parent = d3.select(dom_created_path);
        let g_res_polygons = d3.select("#"+path_class+"_resids").append("g");
        
        data.resids[0]["path_d"] = d3_created_path_parent.attr("d");
        g_res_polygons
        .selectAll("."+path_class+"_resids_"+data_index)
        .data(data.resids)
        .join(
            function(enter) {
                enter.append("path")
                .attr("class", path_class+"_resids_"+data_index + " single_residue_path")
                .attr("resname", function(d){
                    // if (!d.res3 || !d.res_ind) {
                        // console.log("d");
                        // console.log(d);
                    // }
                    return d.res_3 + d.res_ind;
                })
                .attr("d", function(d) {
                    return d.path_d;
                })
                .attr('stroke', function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    // return d["fill"];
                    return d["stroke"];
                    // return "black";
                })
                .attr("fill", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    let o_color = checkFillResidue(d)[1];
                    if (o_color) {
                        return o_color;;
                    }
                    return d["opacity"];
                })
                .attr('stroke-width', function(d) {
                    return d.stroke_size;
                })
                .on("mouseover", function(d) {
                    console.log("");
                    console.log("#######");
                    console.log("MOUSE OVER PATH");
                    console.log("data:");
                    console.log(d);
                    console.log("#######");
                    console.log("");
                })
                ;
            },
            function(update) {
                return update.transition()
                .attr('stroke', function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d["fill"];
                })
                .attr("fill", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    let o_color = checkFillResidue(d)[1];
                    if (o_color) {
                        return o_color;;
                    }
                    return d["opacity"];
                });
            },
            function(exit) {
                return exit.remove();
            }
        );
        let created_paths = document.getElementsByClassName(path_class+"_resids_"+data_index);
        for (let icp = 0; icp < created_paths.length; icp++) {
            const element = created_paths[icp];
            // let path_box = element.getBoundingClientRect();
            let path_box = element.getBBox();
            let xCenter = path_box.x + (path_box.width / 2) ;
            let yCenter = path_box.y + (path_box.height / 2) ;
            let new_datum = d3.select(element).datum();
            new_datum["centroid"] = [xCenter,yCenter];
            d3.select(element).datum(new_datum);
            if (new_datum.res_ind === "NaN") {
                d3.select(element).remove();
            }
        }
    }
    
    /**
     * Calculate Parent Path division points and Plots residue specific path elements for half turns representing 2 or 3 possible residues.
     * d3.curveCardinal is used for drawing new Paths from old points
     * @namespace
     * @exports NaView
     * @name drawHalfHelixResidPolygons 
     * @param {Object} data data object for each half helix turn representing 2 or 3 possible residues
     * @param {String} path_class name to generate group element class of new sub paths
     * @param {number} data_index index of half turn parent element
     * @param {HTMLElement} dom_created_path half turn parent path element as DOM Object
     * @param {number} dom_created_path_length total length of half turn parent path element
     * @param {Object} bottom_curve_points bottom "left" and "right" coordinates of half turn parent path element
     * @param {Object} top_curve_points top "left" and "right" coordinates of half turn parent path element
     * @param {number} height_sline pixel height of each half turn symetrical left and right vertical lines
     * @param {number} curve_length pixel length of each half turn symetrical top and bottom bezier curves
     * @param {Array} division_curve_lengths proportion of each residue in parent path half helix polygon
     */
    function drawHalfHelixResidPolygons(data, path_class, data_index, dom_created_path, dom_created_path_length, bottom_curve_points, top_curve_points, height_sline, curve_length, division_curve_lengths) {
        // var svg = d3.select("#"+svg_id);
        // let gresareas = svg.append("g").attr("class", "helix_aa_areas");
        // console.log("data2");
        // console.log(data);
        // let g_res_polygons = d3.select("#g_helix_resids_" + data.dom_name + "_" + data.dom_itype);
        let g_res_polygons = d3.select("#"+path_class+"_resids").append("g");
        
        var cardinalDrawing = d3.line().curve(d3.curveCardinal); //https://github.com/d3/d3-shape#curveCardinalClosed
    
        let left_mid_pt = calculateDotMiddlePoint(bottom_curve_points["left"], top_curve_points["left"]);
    
        division_curve_lengths
        let right_mid_pt = false;
        if (division_curve_lengths[1]) {
            right_mid_pt = calculateDotMiddlePoint(bottom_curve_points["right"], top_curve_points["right"]);
        }
    
        let smleft_bottom_to_top = [
            dotToCoords(bottom_curve_points["left"]),
            dotToCoords(top_curve_points["left"]),
        ];
    
        let left_bottom_to_top = generateXMidPts(bottom_curve_points["left"], top_curve_points["left"], 10);
        let left_top_to_bottom = generateXMidPts(top_curve_points["left"], bottom_curve_points["left"], 10);
    
        let right_bottom_to_top = false;
        let right_top_to_bottom = false;
        if (division_curve_lengths[1]) {
            right_bottom_to_top = generateXMidPts(bottom_curve_points["right"], top_curve_points["right"], 10);
            right_top_to_bottom = generateXMidPts(top_curve_points["right"], bottom_curve_points["right"], 10);
        }
    
        let array_of_pathpts = [];
        
        if (division_curve_lengths[1]) {
            // each polygon class should be index of half turn residue for easy coloring
            array_of_pathpts = [
                [], // first polygon (left in bck, right in frt)
                [], // center polygon
                [] //right polygon (right in bck, left in frt)
            ];
    
            //first polygon downward segment
            array_of_pathpts[0].push(...pathSegmentToXYPoints(dom_created_path, 0, height_sline, 5));
            //first polygon horizontal segment 1
            array_of_pathpts[0].push(...pathSegmentToXYPoints(dom_created_path, height_sline, bottom_curve_points["left"]["path_len_to_pt"], 5));
            // first polygon upward segment
            array_of_pathpts[0].push(...left_bottom_to_top);
            // array_of_pathpts[0].push(...pathSegmentToXYPoints(dom_created_path, height_sline, bottom_curve_points["left"]["path_len_to_pt"], 5));
            //first polygon horizontal segment 2
            array_of_pathpts[0].push(...pathSegmentToXYPoints(dom_created_path, top_curve_points["left"]["path_len_to_pt"], dom_created_path_length,2));
    
            //second polygon downward segment
            array_of_pathpts[1].push(...left_top_to_bottom);
            //second polygon horizontal segment 1
            array_of_pathpts[1].push(...pathSegmentToXYPoints(dom_created_path, bottom_curve_points["left"]["path_len_to_pt"], bottom_curve_points["right"]["path_len_to_pt"], 2));
            // second polygon upward segment
            array_of_pathpts[1].push(...right_bottom_to_top);
            //second polygon horizontal segment 2
            array_of_pathpts[1].push(...pathSegmentToXYPoints(dom_created_path, top_curve_points["right"]["path_len_to_pt"], top_curve_points["left"]["path_len_to_pt"],2));
    
            //third polygon downward segment
            array_of_pathpts[2].push(...right_top_to_bottom);
            //third polygon horizontal segment 1
            // array_of_pathpts[2].push(...pathSegmentToXYPoints(dom_created_path, bottom_curve_points["right"]["path_len_to_pt"], (height_sline+curve_length), 5));
            array_of_pathpts[2].push(...pathSegmentToXYPoints(dom_created_path, bottom_curve_points["right"]["path_len_to_pt"], (height_sline+division_curve_lengths[1]), 5));
            // third polygon upward segment
            // array_of_pathpts[2].push(...pathSegmentToXYPoints(dom_created_path, (height_sline+curve_length), ((height_sline*2)+curve_length), 5));
            array_of_pathpts[2].push(...pathSegmentToXYPoints(dom_created_path, (height_sline+division_curve_lengths[1]), ((height_sline*2)+division_curve_lengths[1]), 5));
            //third polygon horizontal segment 2
            // array_of_pathpts[2].push(...pathSegmentToXYPoints(dom_created_path, ((height_sline*2)+curve_length), top_curve_points["right"]["path_len_to_pt"],2));
            array_of_pathpts[2].push(...pathSegmentToXYPoints(dom_created_path, ((height_sline*2)+division_curve_lengths[1]), top_curve_points["right"]["path_len_to_pt"],2));
        } else {
            array_of_pathpts = [
                [], // first polygon (left in bck, right in frt)
                [], // center polygon
            ];
    
            //first polygon downward segment
            array_of_pathpts[0].push(...pathSegmentToXYPoints(dom_created_path, 0, height_sline, 5));
            //first polygon horizontal segment 1
            array_of_pathpts[0].push(...pathSegmentToXYPoints(dom_created_path, height_sline, bottom_curve_points["left"]["path_len_to_pt"], 5));
            // first polygon upward segment
            array_of_pathpts[0].push(...left_bottom_to_top);
            // array_of_pathpts[0].push(...pathSegmentToXYPoints(dom_created_path, height_sline, bottom_curve_points["left"]["path_len_to_pt"], 5));
            //first polygon horizontal segment 2
            array_of_pathpts[0].push(...pathSegmentToXYPoints(dom_created_path, top_curve_points["left"]["path_len_to_pt"], dom_created_path_length,2));
            
            // second polygon downward segment
            array_of_pathpts[1].push(...left_top_to_bottom);
            // second polygon horizontal segment 1
            array_of_pathpts[1].push(...pathSegmentToXYPoints(dom_created_path, (height_sline+division_curve_lengths[0]), (height_sline+(curve_length-division_curve_lengths[0])), 2));
            // second polygon upward segment
            array_of_pathpts[1].push(...pathSegmentToXYPoints(dom_created_path, (height_sline+(curve_length-division_curve_lengths[0])), ((height_sline*2)+curve_length), 2));
            // second polygon horizontal segment 2
            array_of_pathpts[1].push(...pathSegmentToXYPoints(dom_created_path, ((height_sline*2)+curve_length), ((height_sline*2)+((curve_length-division_curve_lengths[0])+curve_length)), 2));
        }
    
    
        
        for (let iapp = 0; iapp < array_of_pathpts.length; iapp++) {
            let polygon_pathpts = array_of_pathpts[iapp];
            data.resids[iapp]["pathpts"] = polygon_pathpts;
        }
    
        g_res_polygons
        .selectAll("."+path_class+"_resids_"+data_index)
        .data(data.resids)
        .join(
            function(enter) {
                enter.append("path")
                .attr("class", path_class+"_resids_"+data_index + " single_residue_path")
                .attr("resname", function(d){
                    // if (!d.res3 || !d.res_ind) {
                        // console.log("d");
                        // console.log(d);
                    // }
                    return d.res_3 + d.res_ind;
                })
                .attr("d", function(d) {
                    return cardinalDrawing(d.pathpts);
                })
                .attr('stroke', function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    // return d["fill"];
                    return d["stroke"];
                    // return "black";
                })
                .attr("fill", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    let o_color = checkFillResidue(d)[1];
                    if (o_color) {
                        return o_color;;
                    }
                    return d["opacity"];
                })
                .attr('stroke-width', function(d) {
                    return d.stroke_size;
                })
                .on("mouseover", function(d) {
                    console.log("");
                    console.log("#######");
                    console.log("MOUSE OVER PATH");
                    console.log("data:");
                    console.log(d);
                    console.log("#######");
                    console.log("");
                })
                ;
            },
            function(update) {
                return update.transition()
    
                .attr('stroke', function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d["fill"];
                })
                .attr("fill", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    let o_color = checkFillResidue(d)[1];
                    if (o_color) {
                        return o_color;;
                    }
                    return d["opacity"];
                });
            },
            function(exit) {
                return exit.remove();
            }
        );
        let created_paths = document.getElementsByClassName(path_class+"_resids_"+data_index);
        for (let icp = 0; icp < created_paths.length; icp++) {
            const element = created_paths[icp];
            // let path_box = element.getBoundingClientRect();
            let path_box = element.getBBox();
            // let xCenter = (path_box.left + path_box.right) / 2;
            // let yCenter = (path_box.top + path_box.bottom) / 2;
            let xCenter = path_box.x + (path_box.width / 2) ;
            let yCenter = path_box.y + (path_box.height / 2) ;
            let new_datum = d3.select(element).datum();
            new_datum["centroid"] = [xCenter,yCenter];
            d3.select(element).datum(new_datum);
            if (new_datum.res_ind === "NaN") {
                d3.select(element).remove();
            }
        }
        // for (let icp = 0; icp < created_paths.length; icp++) {
        //     const element = created_paths[icp];
        //     console.log(d3.select(element).datum());
        // }
    }
    
    /**
     * Partitions half-helix paths into new path elements, each corresponding to a single residue
     * @namespace
     * @exports NaView
     * @name draw_helices_resids_cartoon 
     * @see pathStringToStringPoints
     * @see getHalfHelixBoundaries
     * @see drawHalfHelixResidPolygons
     * @see drawSingleHalfHelixResidue
     * @param {Array} data back half helices or front half helices specific data array
     * @param {String} path_class name to generate group element class of new sub paths
     */
    function draw_helices_resids_cartoon(data, path_class) {
        // function draw_helices_resids_cartoon(data, path_class, half_turns_number, aanum_parity) {
        let g_helix_resids = d3.select("#g_helix_" + data[0].dom_name + "_" + data[0].dom_itype)
        .append("g")
        .attr("id", function() {
            return path_class + "_resids"
        })
        .attr("class", "g_helix_resids residue_path")
        // .style("display", "none")
        .style("visibility", "hidden")
        ;
    
    
        let created_paths = document.getElementsByClassName(path_class);
        for (let i_path = 0; i_path < created_paths.length; i_path++) {
            let start_a, mid_a, end_a;
            
            let dom_created_path = created_paths[i_path];
            let dom_cpath_bbox = dom_created_path.getBBox();
            let dom_created_path_centroid = [dom_cpath_bbox.x + dom_cpath_bbox.width/2, dom_cpath_bbox.y + dom_cpath_bbox.height/2];
    
            // mid_a = [dom_created_path_centroid[0], dom_created_path_centroid[1]];
    
            let d3_created_path = d3.select(dom_created_path);
            let path_data = d3_created_path.datum();
            let ptype = path_data.points[0].pathtype;
            let pind = path_data.points[0].turn_index;
    
            // let creation_string ="Domain: "+ path_data.dom_name +" Helix: "+ path_data.dom_itype +" Half Type: "+ ptype +" Half Index: "+ pind;
            // console.log(creation_string);
    
            let parts_division = path_data.parts_division;
    
            let path_sline_str = pathStringToStringPoints(d3_created_path, "M");
            let path_sline_split = path_sline_str.split(" ");
            let height_sline = Math.abs(parseFloat(path_sline_split[1].split(",")[1]) - parseFloat(path_sline_split[2].split(",")[1]));
            
            //for this use getTotalLength of path for curves
            let dom_created_path_length = dom_created_path.getTotalLength();
    
            //and subtract 2 times line height and divide by 2
            let curve_length = (dom_created_path_length - (2*height_sline)) / 2;
            
            let curve_step =  curve_length / 3;
            // let displacement_ps = curve_step*style_obj["protein"]["helix_draw_opts"]["draw"]["aa_area_perc_displacement"];
            // //the use getpointatlength for getting the desired points at each third of path
            
            let current_division = {
                "size": d3.sum(parts_division),
                "curve_steps": []
            }
            for (let ipd = 0; ipd < parts_division.length-1; ipd++) {
                current_division["curve_steps"].push({"size":parts_division[ipd], "csize": undefined});
            }
    
            if (parts_division.length > 1) {
                let results_pts = false;
                results_pts = getHalfHelixBoundaries(dom_created_path, dom_created_path_length, height_sline, current_division);
                drawHalfHelixResidPolygons(path_data, path_class,i_path, dom_created_path, dom_created_path_length, results_pts[0], results_pts[1], height_sline, curve_length, [results_pts[2], results_pts[3]]);
            } else {
                drawSingleHalfHelixResidue(path_data, path_class,i_path, dom_created_path)
            }
        }
    }
    
    /**
     * Plots helices in Cartoon Mode.
     * 1. Generates data for each Helix half turns
     * 2. Builds bezier curves according to helix properties set in style_obj
     * 3. Partition Path Helix Half Turns SVG Object into sub-objects for each residue.
     * @namespace
     * @exports NaView
     * @name draw_helices_cartoon 
     * @see gen_helix_cartoon_halfturn_data
     * @see buildPathStringFromData
     * @see draw_helices_resids_cartoon
     * @param {Array} data helix data generated from processRawUniProt
     */
    function draw_helices_cartoon(data) {
    // function draw_helices_cartoon(data, dataId, dataClass) {
    
        let svg_element = d3.select("#"+svg_id)
        .append("g")
        .attr("class", "helices_group");
    
        for (let id = 0; id < data.length; id++) {
            let obj = data[id];
            let helix_to_draw_data = gen_helix_cartoon_halfturn_data(obj);
            
            //create helix g and draw it
            let cartoon_helix_g = svg_element.append("g")
            .attr("id", function(){
                return "g_helix_" + obj.dom_name + "_" + obj.dom_itype
            })
            .attr("class", "element_path_group")
            .datum(obj)
            ;
    
            //draw back helix path
            let bck_path_class = "bck_h_hel_path_" + obj.dom_name + "_" + obj.dom_itype;
            cartoon_helix_g.append("g")
                .attr("class", "back_half_helix element_path")
                .selectAll("."+bck_path_class)
                .data(helix_to_draw_data["back"])
                .enter()
                .append('path')
                .attr("class", bck_path_class)
                .attr('d', function(d) {
                    return buildPathStringFromData(d);
                })
                .attr('stroke', function(d) {return d.stroke_color;})
                .attr('stroke-width', function(d) {return d.stroke_size;})
                .attr('fill', function(d){return d.fill;})
                ;
    
            // draw_helices_resids_cartoon(helix_to_draw_data["back"], bck_path_class,  helix_to_draw_data["half_turns_number"], helix_to_draw_data["aanum_parity"]);
            draw_helices_resids_cartoon(helix_to_draw_data["back"], bck_path_class);
            
            //draw front helix path
            let frt_path_class = "frt_h_hel_path_" + obj.dom_name + "_" + obj.dom_itype;
            cartoon_helix_g.append("g")
                .attr("class", "front_half_helix element_path")
                .selectAll("."+frt_path_class)
                .data(helix_to_draw_data["front"])
                .enter()
                .append('path')
                .attr("class", frt_path_class)
                .attr('d', function(d) {
                    return buildPathStringFromData(d);
                })
                .attr('stroke', function(d) {return d.stroke_color;})
                .attr('stroke-width', function(d) {return d.stroke_size;})
                .attr('fill', function(d){return d.fill;})
                ;
                // draw_helices_resids_cartoon(helix_to_draw_data["front"], frt_path_class,  helix_to_draw_data["half_turns_number"], helix_to_draw_data["aanum_parity"]);
                draw_helices_resids_cartoon(helix_to_draw_data["front"], frt_path_class);
        }
    }
    
    /**
     * Calculates helices anchoring points for loop elements
     * @namespace
     * @exports NaView
     * @name get_helices_endpoints 
     * @param {String} helix_mode helix drawing mode defined in stye_obj
     * @param {Array} helices_data already plotted helix data generated from processRawUniProt with draw areas
     * @yields {Array} already plotted helix data now also including anchoring points
     */
    function get_helices_endpoints(helix_mode, helices_data) {
        //iterate over helices, get their elements, calculate centroid or box points, push to data
        for (let ihg = 0; ihg < helices_data.length; ihg++) {
            let helix_data = helices_data[ihg];
            let helix_group = document.getElementById("g_helix_"+helix_data.dom_name+"_"+helix_data.dom_itype);
            let residue_groups = helix_group.getElementsByClassName("g_helix_resids");
            let helix_group_bcr = helix_group.getBBox()
            let maximum_y = 0;
            let maximum_bbox;
            let element_of_maximum_y;
            for (let irg = 0; irg < residue_groups.length; irg++) {
                let residue_group = residue_groups[irg];
                let residue_elements = residue_group.childNodes;
                for (let ire = 0; ire < residue_elements.length; ire++) {
                    let residue_element = residue_elements[ire];
                    let residue_element_box = residue_element.getBoundingClientRect();
                    if (residue_element_box.y > maximum_y) {
                        element_of_maximum_y = residue_element;
                        maximum_y = residue_element_box.y;
                        maximum_bbox = residue_element.getBBox();
                    }
                }
            }
            let x_anchor_start = helix_group_bcr.x + (helix_group_bcr.width/2);
            let x_anchor_end = maximum_bbox.x + (maximum_bbox.width/2);
            if (helix_mode === "cartoon") {
                x_anchor_start = helix_group_bcr.x;
                x_anchor_end = maximum_bbox.x + maximum_bbox.width;
                let element_to_data = element_of_maximum_y.querySelector("path");
                let element_to_data_class = d3.select(element_to_data).attr("class");
                if (element_to_data_class.includes("frt")) {
                    x_anchor_end = maximum_bbox.x;
                }
            }
            let y_anchor_start = helix_group_bcr.y;
            let y_anchor_end = maximum_bbox.y + maximum_bbox.height;
            helices_data[ihg].anchor = {
                "top":[x_anchor_start,y_anchor_start],
                "bottom":[x_anchor_end,y_anchor_end]
            }
        }
        return helices_data;
    }
    
    /**
     * Plots helices in mode defined by style_obj.
     * @namespace
     * @exports NaView
     * @name draw_helices 
     * @see draw_helices_box
     * @see draw_helices_cylinder
     * @see draw_helices_cartoon
     * @see get_helices_endpoints
     * @param {Array} helices_data helix data generated from processRawUniProt with draw area
     * @yields {Array}  helix data generated from processRawUniProt with additional information generated from plot
     */
    function draw_helices(helices_data) {
        //helix can be box, cylinder or cartoon helix
        //membrane can be box or lipid
        if (style_obj.protein.helix_mode === "box") {
            // draw_helices_box(helices_data, "helices", "helices");
            draw_helices_box(helices_data, "helices");
        } else if (style_obj.protein.helix_mode === "cylinder") {
            // draw_helices_cylinder(helices_data, "helices", "helices");
            draw_helices_cylinder(helices_data, "helices");
        } else if (style_obj.protein.helix_mode === "cartoon") {
            // draw_helices_cartoon(helices_data, "helices", "helices");
            draw_helices_cartoon(helices_data);
        }
        helices_data = get_helices_endpoints(style_obj.protein.helix_mode, helices_data);
        return helices_data;
    }
    
    /**
     * Creates a vector from the difference of two 2d-vectors
     * @namespace
     * @exports NaView
     * @name createVector 
     * @param {Array} p1 array of coordinates 1
     * @param {Array} p2 array of coordinates 2
     * @yields {Array} array of coordinates from the difference between two vectors
     */
    function createVector(p1, p2) {
        return [p1[0]-p2[0], p1[1] - p2[1]];
    }

    /**
     * Normalizes a 2d-vector
     * @namespace
     * @exports NaView
     * @name normalizeVector 
     * @param {Array} v1 array of coordinates 1
     * @yields {Array} normalized array of coordinates
     */
    function normalizeVector(v1) {
        let dist = Math.sqrt( Math.pow(v1[0], 2) + Math.pow(v1[1], 2));
        return [v1[0]/dist, v1[1]/dist];
    }
    
    /**
     * Scales a 2d-vector to a given length
     * @namespace
     * @exports NaView
     * @name scaleVector 
     * @param {Array} v1 array of coordinates 1
     * @param {number} val length to scale vector to
     * @yields {Array} scaled array of coordinates
     */
    function scaleVector(v1, val) {
        return [v1[0] * val, v1[1] * val];
    }

    /**
     * Rotates a 2d-vector 90 degrees in the clockwise or anticlockwise directions
     * @namespace
     * @exports NaView
     * @name rotate90 
     * @param {Array} v1 array of coordinates 1
     * @param {String} direction String that defines clockwise or anticlockwise 90 rotation of vector
     * @param {Array} centerp array of coordinates to center rotated vector
     * @yields {Array} rotated array of coordinates
     */
    function rotate90(v1, direction, centerp) {
        if (!direction) {
            direction = "clockwise";
        }
        if (!centerp) {
            centerp = [0, 0];
        }
        if (direction === "clockwise") {
            return [
                // (v1[1] - centerp[1]) + centerp[0],
                // (-1*(v1[0]-centerp[0]))+centerp[1]
                v1[1]+centerp[0],
                (-1*v1[0])+centerp[1]
            ];
        } else {
            return [
                // (-1*(v1[1] -centerp[1])) + centerp[0],
                // (v1[0]-centerp[0])+centerp[1]
                (-1*v1[1])+centerp[0],
                v1[0]+centerp[1]
            ];
        }
    }

    /**
     * Rotates a 2d-vector by a given angle
     * @namespace
     * @exports NaView
     * @name rotateByAng 
     * @param {Array} v1 array of coordinates 1
     * @param {Array} centerp array of coordinates to center rotated vector
     * @param {number} angle angle in degrees to rotate a vector to
     * @yields {Array} rotated array of coordinates
     */
    function rotateByAng(v1, centerp, angle) {
        let x = v1[0];
        let y = v1[1];
        let cx = centerp[0];
        let cy = centerp[1];
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            // nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            // ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
            nx = (cos * x) + (sin * y) + cx,
            ny = (cos * y) - (sin * x) + cy;
        return [nx, ny];
    }

    /**
     * Calculates coordinates at a given angle and distance from another point
     * @namespace
     * @exports NaView
     * @name getPointAtAngleDistance 
     * @param {number} x coordinate x of initial point
     * @param {number} y coordinate y of initial point
     * @param {number} angle desired angle to find a point
     * @param {number} distance desired distance to find a point
     * @yields {Array} coordinates at a given angle and distance
     */
    function getPointAtAngleDistance(x, y, angle, distance) {
        var result = [];
        result.push(Math.round(Math.cos(angle * Math.PI / 180) * distance + x));
        result.push(Math.round(Math.sin(angle * Math.PI / 180) * distance + y));
        return result;
    }
    /**
     * Calculates angle between three points. Center point is B
     * @namespace
     * @exports NaView
     * @name find_angle 
     * @param {Array} A array of coordinates A
     * @param {Array} B array of coordinates B (center)
     * @param {Array} C array of coordinates C
     * @yields {number} coordinates at a given angle and distance
     */
    function find_angle(A,B,C) {
        var AB = Math.sqrt(Math.pow(B[0]-A[0],2)+ Math.pow(B[1]-A[1],2));    
        var BC = Math.sqrt(Math.pow(B[0]-C[0],2)+ Math.pow(B[1]-C[1],2)); 
        var AC = Math.sqrt(Math.pow(C[0]-A[0],2)+ Math.pow(C[1]-A[1],2));
        let radians_angle = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
        return radians_angle * (180/Math.PI);
    }

    /**
     * Calculates the length of a SVG path without displaying it on a screen
     * @namespace
     * @exports NaView
     * @name getGhostPathLength 
     * @param {Array} pts Array of coordinates to draw a path using d3.curveNatural
     * @param {String} path_id_keep id of generated "ghost" path. if set, vector is not automatically removed from SVG
     * @yields {number} calculated length of a vector
     */
    function getGhostPathLength(pts, path_id_keep) {
        let curve = d3.line().curve(d3.curveNatural);
        let pg = d3.select("#"+svg_id)
        .append("g")
        .attr("id", function() {
            if (path_id_keep) {
                return "par"+path_id_keep;
            }
            return;
        })
        .attr("visibility", "hidden");

        let p = pg.append("path")
        .attr("id", function() {
            if (path_id_keep) {
                return path_id_keep;
            }
            return;
        })
        .attr("d", function() {
            return curve(pts);
        });

        let val = p.node().getTotalLength();
        val = roundDecimals(val, 2);
        if (!path_id_keep) {
            pg.remove();
        }
        return val;
    }
    /**
     * Calculates length of a vector between two points using the pythagorean theorem
     * @namespace
     * @exports NaView
     * @name euclideanDistance 
     * @param {Array} p1 array of coordinates 1
     * @param {Array} p2 array of coordinates 2
     * @yields {number} length of vector between two coordinates
     */
    function euclideanDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    }

    /**
     * Simple loop curve generating function.<br>
     * 1. A centroid is calculated between two points<br>
     * 2. This centroid y position is raised by a given step in a given direction (scaled_centroid point)<br>
     *    2a. A skew value CAN added to the x positioning of this centroid point<br>
     * 3. Original and scaled centroid are returned.<br>
     * @namespace
     * @exports NaView
     * @name generateSimpleLoopPoints 
     * @param {Array} p1 point 1 (start)
     * @param {Array} p2 point 2 (end)
     * @param {number} step_y number of pixels to scale centroid generating y scaled curve center
     * @param {number} y_direction (1.0 or -1.0), y direction to scale step
     * @param {number} x_skew_perc Optional percentual between centroid x and point 1 x to move the y scaled curve center
     * @param {Object} add_wavefold_obj Optional: addition of a folding object. See <i><b></b></i>
     * @yields {Array} list of three points composing curve to be generated by d3.curveNatural left to right: (p1, scaled_centroid, p2)
     */
    function generateSimpleLoopPoints(p1, p2, step_y, y_direction, x_skew_perc, add_wavefold_obj) {
        if (!y_direction) {
            y_direction = 1.0;
        }
        if (!x_skew_perc) {
            x_skew_perc = 0.0;
        }
        let x1 = p1[0];
        let y1 = p1[1];

        let x2 = p2[0];
        let y2 = p2[1];

        let xc = (x1+x2)/2;
        let yc = (y1+y2)/2;

        let x_p1 = xc + (x_skew_perc*(xc-x1));
        let y_p1 = yc + ((y_direction*-1)* step_y);

        let resulting_points = [
            [x1,y1],
            [x_p1,y_p1],
            [x2,y2]
        ];
        if (add_wavefold_obj) {
            if (add_wavefold_obj.type === "fold") {
                resulting_points = foldAddition(resulting_points, add_wavefold_obj);
            }
            // } else if (add_wavefold_obj.type === "wave")  {
            //     resulting_points = waveAddition(resulting_points, add_wavefold_obj);
            // }
        }
        return resulting_points;
    }

    /**
     * Swirled loop curve generating function.<br>
     * 1. A centroid is calculated between two points<br>
     * 2. This centroid y position is raised by a given step in a given direction (scaled_centroid point)<br>
     *    2a. A skew value CAN added to the x positioning of this centroid point<br>
     *    2b. A swirl value is added to the x positioning of this centroid point<br>
     * 3. Original and scaled centroid are returned.<br>
     * 4. Two new points (swirl points) are generated.<br>
     *    4a. Their x coordinates are guided by the opposite swirl value (-1*) of the centroid swirl<br>
     *    4b. Their y coordinates are guided by a percentage of the total y step<br>
     * @namespace
     * @exports NaView
     * @name generateSwirlLoopPoints 
     * @param {Array} p1 point 1 (start)
     * @param {Array} p2 point 2 (end)
     * @param {number} swirl_x swirling value to generate wavy curve
     * @param {number} step_y number of pixels to scale centroid generating y scaled curve center
     * @param {number} perc_step_y  (0 to 1), percentage of y step to generate swirl points
     * @param {number} y_direction (1.0 or -1.0), y direction to scale step
     * @param {Object} add_wavefold_obj Optional: addition of a folding object. See <i><b></b></i>
     * @yields {Array} list of five points composing curve to be generated by d3.curveNatural left to right: (p1, pswirl1, scaled_centroid, pswirl2, p2)
     */
    function generateSwirlLoopPoints(p1, p2, swirl_x, step_y, perc_step_y, y_direction, add_wavefold_obj) {
        if (!y_direction) {
            y_direction = 1.0;
        }
        let x1 = p1[0];
        let y1 = p1[1];

        let x2 = p2[0];
        let y2 = p2[1];

        let xc = (x1+x2)/2;
        let yc = (y1+y2)/2;

        let swirl_value = (swirl_x*(xc-x1));
        let x_p1 = x1 - swirl_value;
        let y_p1 = yc + ((y_direction*-1)* (step_y*perc_step_y));
        
        // let x_p2 = xc + ((x_direction*-1) * swirl_value);
        let x_p2 = xc - swirl_value;
        let y_p2 = yc + ((y_direction*-1)* step_y);

        let x_p3 = x2 - swirl_value;
        let y_p3 = yc + ((y_direction*-1)* (step_y*perc_step_y));

        let resulting_points = [
            [x1,y1],
            [x_p1,y_p1],
            [x_p2,y_p2],
            [x_p3,y_p3],
            [x2,y2]
        ];
        return resulting_points;
    }

    /**
     * Bulb loop curve generating function.<br>
     * 1. A centroid is calculated between two points<br>
     * 2. This centroid y position is raised by a given step in a given direction (scaled_centroid point)<br>
     *    2a. A skew value CAN added to the x positioning of this centroid point<br>
     * 3. Original and scaled centroid are returned.<br>
     * 4. Two new points (bulb points) are generated:<br>
     *    4a. They are created before the first point and after the second point (horizontally) by a given x_step<br>
     *    4b. Their vertical position is arranged at a percentage of the y step<br>
     * @namespace
     * @exports NaView
     * @name generateBulbLoopPoints 
     * @param {Array} p1 point 1 (start)
     * @param {Array} p2 point 2 (end)
     * @param {number} step_x number of pixels to scale bulb points
     * @param {number} step_y number of pixels to scale centroid generating y scaled curve center
     * @param {number} perc_step_y  (0 to 1), percentage of y step to generate bulb points
     * @param {number} y_direction (1.0 or -1.0), y direction to scale bulb points
     * @param {number} x_skew_perc Optional percentual between centroid x and point 1 x to move the y scaled curve center
     * @param {Object} add_wavefold_obj Optional: addition of a folding object. See <i><b></b></i>
     * @yields {Array} list of five points composing curve to be generated by d3.curveNatural. left to right: (pbulb1, p1, scaled_centroid, p3, pbulb2)
     */
    function generateBulbLoopPoints(p1, p2, step_x, step_y, perc_step_y, y_direction, x_skew_perc, add_wavefold_obj) {
        if (!y_direction) {
            y_direction = 1.0;
        }
        if (!x_skew_perc) {
            x_skew_perc = 0.0;
        }
        let x1 = p1[0];
        let y1 = p1[1];

        let x2 = p2[0];
        let y2 = p2[1];

        let xc = (x1+x2)/2;
        let yc = (y1+y2)/2;

        let x_p1 = x1-step_x;
        let y_p1 = yc + ((y_direction*-1)* (step_y*perc_step_y));


        // let x_p2 = xc;
        let x_p2 = xc + (x_skew_perc*(xc-x1));
        let y_p2 = yc + ((y_direction*-1)* step_y);

        let x_p3 = x2+step_x;
        let y_p3 = yc + ((y_direction*-1)* (step_y*perc_step_y));

        let resulting_points = [
            [x1,y1],
            [x_p1,y_p1],
            [x_p2,y_p2],
            [x_p3,y_p3],
            [x2,y2]
        ];
        if (add_wavefold_obj) {
            if (add_wavefold_obj.type === "fold") {
                resulting_points = foldAddition(resulting_points, add_wavefold_obj);
            }
            // } else if (add_wavefold_obj.type === "wave")  {
            //     resulting_points = waveAddition(resulting_points, add_wavefold_obj);
            // }
        }
        return resulting_points;
    }

    /**
     * Mushroom loop curve generating function.<br>
     * 1. A centroid is calculated between two points<br>
     * 2. This centroid y position is raised by a given step in a given direction (scaled_centroid point)<br>
    *    2a. A skew value CAN added to the x positioning of this centroid point<br>
     * 3. Original and scaled centroid are returned.<br>
     * 4. Two new points (bulb points) are generated:<br>
     *    4a. They are created before the first point and after the second point (horizontally) by a given x_step<br>
     *    4b. Their vertical position is arranged at a percentage of the y step<br>
     * 5. Two new points (mushroom points) are generated:<br>
     *    5a. Their x coordinate is defined by a percentage of the centroid to p1 and p2<br>
     *    5b. Their y coordinate is arranged at a percentage of the y step<br>
     * @namespace
     * @exports NaView
     * @name generateMushRoomLoopPoints 
     * @param {Array} p1 point 1 (start)
     * @param {Array} p2 point 2 (end)
     * @param {number} step_x number of pixels to scale bulb points
     * @param {number} step_y number of pixels to scale centroid generating y scaled curve center
     * @param {number} perc_center_x (0 to 1), percentage of p1-center and p2-center for mushroom points
     * @param {number} perc_step_y1  (0 to 1), percentage of y step to generate bulb points
     * @param {number} perc_step_y2  (0 to 1), percentage of y step to generate mushroom points
     * @param {number} y_direction (1.0 or -1.0), y direction to scale step
     * @param {number} x_skew_perc Optional percentual between centroid x and point 1 x to move the y scaled curve center
     * @param {Object} add_wavefold_obj Optional: addition of a folding object. See <i><b></b></i>
     * @yields {Array} list of seven points composing curve to be generated by d3.curveNatural. left to right: (pbulb1, p1, pmush1, scaled_centroid, pmush2, p3, pbulb2)
     */
    function generateMushRoomLoopPoints(p1,p2, step_x, step_y, perc_center_x, perc_step_y1, perc_step_y2, y_direction, x_skew_perc, add_wavefold_obj) {
        if (!y_direction) {
            y_direction = 1.0;
        }
        if (!x_skew_perc) {
            x_skew_perc = 0.0;
        }
        let x1 = p1[0];
        let y1 = p1[1];

        let x2 = p2[0];
        let y2 = p2[1];

        let xc = (x1+x2)/2;
        let yc = (y1+y2)/2;

        // let x_p3 = xc;
        let x_p3 = xc + (x_skew_perc*(xc-x1));
        let y_p3 = yc + ((y_direction*-1)* step_y);

        let x_p1 = xc - (perc_center_x*(xc-x1));
        let y_p1 = yc + (((y_direction*-1)* step_y) * perc_step_y1);
        
        let x_p2 = x1 - step_x;
        let y_p2 = yc + (((y_direction*-1)* step_y) * perc_step_y2);
        
        let x_p4 = x2 + step_x;
        let y_p4 = yc + (((y_direction*-1)* step_y) * perc_step_y2);

        let x_p5 = xc + (perc_center_x*(xc-x1));
        let y_p5 = yc + (((y_direction*-1)* step_y) * perc_step_y1);

        let resulting_points = [
            [x1,y1],
            [x_p1,y_p1],
            [x_p2,y_p2],
            [x_p3,y_p3],
            [x_p4,y_p4],
            [x_p5,y_p5],
            [x2,y2]
        ];
        if (add_wavefold_obj) {
            if (add_wavefold_obj.type === "fold") {
                resulting_points = foldAddition(resulting_points, add_wavefold_obj);
            }
            // } else if (add_wavefold_obj.type === "wave")  {
            //     resulting_points = waveAddition(resulting_points, add_wavefold_obj);
            // }
        }
        return resulting_points;
    }

    /**
     * Skewed loop curve generating function.<br>
     * 1. A centroid is calculated between two points<br>
     * 2. This centroid y position is raised by a given step in a given direction (skewed_centroid point)<br>
     *    2a. A skew value is added to the x positioning of this centroid point<br>
     * @namespace
     * @exports NaView
     * @name generateSkewedSimpleLoopPoints 
     * @param {Array} p1 point 1 (start)
     * @param {Array} p2 point 2 (end)
     * @param {number} perc_center_x (0 to 1), percentage of p1-center for skewed point
     * @param {number} step_y number of pixels to scale centroid generating y scaled curve center
     * @param {number} y_direction (1.0 or -1.0), y direction to scale step
     * @yields {Array} list of three points composing curve to be generated by d3.curveNatural left to right: (p1, skewed_centroid, p2)
     */
    function generateSkewedSimpleLoopPoints(p1, p2, perc_center_x, step_y, y_direction) {
        if (!y_direction) {
            y_direction = 1.0;
        }
        let x1 = p1[0];
        let y1 = p1[1];

        let x2 = p2[0];
        let y2 = p2[1];

        let xc = (x1+x2)/2;
        let yc = (y1+y2)/2;

        let x_p1 = xc + (perc_center_x*(xc-x1));
        let y_p1 = yc + ((y_direction*-1)* step_y);

        let resulting_points = [
            [x1,y1],
            [x_p1,y_p1],
            [x2,y2]
        ];
        return resulting_points;
    }

    /**
     * Wavy loop curve generating function.<br>
     * 1. N points are created between the start and end points<br>
     * 2. Each point is a created from a Normal from the vector between the start and end points<br>
     * 3. Height scales of N curves is defined as a percentage of a given maximum step<br>
     * @namespace
     * @exports NaView
     * @name generateNWaveCurves 
     * @param {Array} p1 point 1 (start)
     * @param {Array} p2 point 2 (end)
     * @param {number} n_of_centers number of wave peaks to generate
     * @param {number} step_height number of pixels to generate wave peaks centers
     * @param {Array} perc_centers_height array of percentages to generate wave peaks from step height
     * @param {Boolean} clockwise starting orientation of generated wave peaks clockwise (true) or counterclockwise (false)
     * @param {number} rotate_loop angle to rotate final path in relation to the its anchored point
     * @yields {Array} list of N points composing curve to be generated by d3.curveNatural left to right: (p1, ... , p2)
     */
    function generateNWaveCurves(p1, p2, n_of_centers, step_height,perc_centers_height, clockwise, rotate_loop) {
        if (!clockwise) {
            clockwise = true;
        }
        let resulting_points = [];
        
        let x1 = p1[0];
        let y1 = p1[1];

        let x2 = p2[0];
        let y2 = p2[1];
        if (rotate_loop) {
            if (y2 > y1) {
                let vecp1p2 = createVector(p2, p1);
                let p2rotation = rotateByAng(vecp1p2, [x1, y1], rotate_loop);
                x2 = p2rotation[0];
                y2 = p2rotation[1];
            } else {
                let vecp1p2_2 = createVector(p1, p2);
                let p1rotation = rotateByAng(vecp1p2_2, [x2, y2], rotate_loop);

                x1 = p1rotation[0];
                y1 = p1rotation[1];
            }
        }
        resulting_points.push([x1,y1]);

        // let n_of_centers = perc_x_centers_array.length;
        let x_step_size = (x2-x1)/(n_of_centers+1);
        let y_step_size = (y2-y1)/(n_of_centers+1);
        let prev_xpc = x1;
        let prev_ypc = y1;
        for (let i = 1; i <= n_of_centers; i++) {

            let x_pc = x1+(x_step_size * i);
            let y_pc = y1+(y_step_size * i);

            let current_step = step_height * perc_centers_height[i-1];

            let rotation_direction;
            if (clockwise === true) {
                rotation_direction = "clockwise";
            } else {
                rotation_direction = "anticlockwise";
            }
            clockwise = !clockwise;

            let v_pc = createVector([x_pc+0, y_pc+0], [prev_xpc, prev_ypc]);
            let v_pc_norm = normalizeVector(v_pc);
            let v_pc_scale = scaleVector(v_pc_norm, current_step);
            let v_pc_rot = rotate90(v_pc_scale, rotation_direction, [x_pc, y_pc]);
            resulting_points.push(v_pc_rot);
            prev_xpc = x_pc;
            prev_ypc = y_pc;
        }
        resulting_points.push([x2,y2]);
        return resulting_points;
    }

    /**
     * Function to add horizontal folds on Simple, Bulb and Mushroom curves.<br>
     * Works by finding x centroid of current curve and y point connected to closest membrane (anchored centroid) <br>
     * Folds are then created by creating copies of the curve points with scaled distances to this anchored centroid
     * with the first and last points excluded.<br>
     * @namespace
     * @exports NaView
     * @name foldAddition 
     * @param {Array} resulting_points curve points to draw d3.curveNatural curve
     * @param {Object} add_fold_obj Object part of style_obj describing shape of this horizontal fold (number of folds, relative heights)
     * @yields {Array} list of N points composing curve to be generated by d3.curveNatural left to right: (p1, ... , p2)
     */
    function foldAddition(resulting_points, add_fold_obj) {
        let new_resulting_points = [];
        let half_index = Math.ceil(resulting_points.length / 2);
        let ghost_length = getGhostPathLength(resulting_points, "ghostParent");
        let ghost_path_doc = document.getElementById("ghostParent");
        
        let start_abs = ghost_length * add_fold_obj.start;

        let first_point = ghost_path_doc.getPointAtLength(start_abs);
        let first_point_xy = [first_point.x, first_point.y];

        new_resulting_points = deepCopy(resulting_points).slice(0, half_index);
        let new_points = [];
        let anchored_centroid = calculateDotArrayMiddlePoint(resulting_points[0],resulting_points[resulting_points.length-1]);
        if (add_fold_obj.x_scaling !== 0) {
            anchored_centroid[0] = anchored_centroid[0]+(euclideanDistance(anchored_centroid, resulting_points[resulting_points.length-1])* add_fold_obj.x_scaling);
        }

        let resulting_points_no_fl = deepCopy(resulting_points);
        resulting_points_no_fl = resulting_points_no_fl.slice(1,resulting_points.length-1);
        
        for (let ih = 0; ih < add_fold_obj.heights.length; ih++) {
            let scale_factor = add_fold_obj.heights[ih];
            let to_new_points = [];
            // let starting_loop_point;
            if (ih % 2 === 0 ) {
                for (let iep = resulting_points_no_fl.length-1; iep >= 0; iep--) {
                    let point = resulting_points_no_fl[iep];
                    let dist_to_centroid = euclideanDistance(point, anchored_centroid);
                    let scale_value = dist_to_centroid * scale_factor;
                    let vector_point_to_centroid = createVector(point, anchored_centroid);
                    let vector_point_to_centroid_norm = normalizeVector(vector_point_to_centroid);
                    let vector_point_to_centroid_norm_scaled = scaleVector(vector_point_to_centroid_norm, scale_value);
                    let point_to_centroid_norm_scaled = createVector(point, vector_point_to_centroid_norm_scaled);

                    to_new_points.push(point_to_centroid_norm_scaled);
                }
            } else {
                for (let iep = 0; iep < resulting_points_no_fl.length; iep++) {
                    let point = resulting_points_no_fl[iep];
                    let dist_to_centroid = euclideanDistance(point, anchored_centroid);
                    let scale_value = dist_to_centroid * scale_factor;
                    let vector_point_to_centroid = createVector(point, anchored_centroid);
                    let vector_point_to_centroid_norm = normalizeVector(vector_point_to_centroid);
                    let vector_point_to_centroid_norm_scaled = scaleVector(vector_point_to_centroid_norm, scale_value);
                    let point_to_centroid_norm_scaled = createVector(point, vector_point_to_centroid_norm_scaled);

                    to_new_points.push(point_to_centroid_norm_scaled);
                }
            }
            new_points.push(...to_new_points);
        }
        new_resulting_points.push(first_point_xy);
        new_resulting_points.push(...deepCopy(new_points));
        new_resulting_points.push(resulting_points[resulting_points.length-1]);
        
        // plotPoints(new_points);
        // plotPoints([anchored_centroid]);
        d3.select("#parghostParent").remove();
        // return resulting_points;
        return new_resulting_points;
    }

    /**
     * For scaled loops, generate a linear, power or log scale
     * @namespace
     * @exports NaView
     * @name makeLoopScaling 
     * @param {Object} scale_var variable containing "domain" and "range" of loop scale
     * @param {Object} loop_length_calculation variable part of style_obj containing additional information about scale such as exponent and base
     * @yields d3.js scale function for loop length calculations
     */
    function makeLoopScaling(scale_var, loop_length_calculation) {
        let loop_scaling;
        if (scale_var.scale === "linear") {
            loop_scaling = d3.scaleLinear()
            .domain(scale_var.domain)
            .range(scale_var.range);
        } else if (scale_var.scale === "power") {
            loop_scaling = d3.scalePow()
            .exponent(loop_length_calculation.calc.exponent)
            .domain(scale_var.domain)
            .range(scale_var.range);
        } else if (scale_var.scale === "log") {
            loop_scaling = d3.scaleLog()
            .base(loop_length_calculation.calc.base)
            .domain(scale_var.domain)
            .range(scale_var.range);
        }
        return loop_scaling;
    }
    
    /**
     * Verifies if a fold object should be added to this given loop
     * @namespace
     * @exports NaView
     * @name checkWaveFold 
     * @param {Array} loop_data loop data generated from processRawUniProt function
     * @param {Object} add_wave_fold_dict_array object part of style_obj describing loops in which folds should be added
     * @yield null or Object part of style_obj describing how loop should be folded
     */
    function checkWaveFold(loop_data, add_wave_fold_dict_array) {
        let wave_fold_obj;
        let dom_name;
        let dom_itype;
        if (loop_data.hasOwnProperty("dom_name") && loop_data.hasOwnProperty("dom_itype") ) {
            dom_name = loop_data.dom_name;
            dom_itype = loop_data.dom_itype;
        }
        if (dom_name && dom_itype) {
            wave_fold_obj = add_wave_fold_dict_array[dom_name][dom_itype];
        } else if (loop_data.hasOwnProperty("dom_iname")) {
            let dom_iname = loop_data.dom_iname;
            if (dom_iname) {
                wave_fold_obj = add_wave_fold_dict_array[dom_iname];
            }
        }
        return wave_fold_obj;
    }
    
    /**
     * Checks for an array of coordinate points if any coordinate is NaN
     * @namespace
     * @exports NaView
     * @name checkForNaN 
     * @param {Array} points array of coordinate points
     * @yields {Boolean} true if NaN is present or false if NaN is absent
     */
    function checkForNaN(points) {
        for (let ip = 0; ip < points.length; ip++) {
            // const element = points[ip];
            if (isNaN(points[ip][0]) || isNaN(points[ip][1])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Generate loop points for short and long loops of fixed height and width
     * @namespace
     * @exports NaView
     * @name calculateFixedPointData 
     * @param {Array} short_loop_data array of short or long loop data generated by processRawUniProt
     * @param {Object} loop_length_calculation Object part of style_obj describing how loop length should be calculated
     * @param {Object} loop_drawing_shape Object part of style_obj describing which loop shape should be drawn
     * @yields {Array} array of short or long loop data generated by processRawUniProt with points describing loop added
     */
    function calculateFixedPointData(short_loop_data, loop_length_calculation, loop_drawing_shape) {
        let curve_height;
        let curve_width;
        if (loop_drawing_shape.type === "simple") {
            curve_height = svg_height * loop_length_calculation.calc.height;
        } else if (loop_drawing_shape.type === "swirl") {
            curve_height = svg_height * loop_length_calculation.calc.height;
        } else if (loop_drawing_shape.type === "bulb") {
            curve_height = svg_height * loop_length_calculation.calc.height;
            curve_width = svg_width * loop_length_calculation.calc.width;
        } else if (loop_drawing_shape.type === "mushroom") {
            curve_height = svg_height * loop_length_calculation.calc.height;
            curve_width = svg_width * loop_length_calculation.calc.width;
        }
        for (let isld = 0; isld < short_loop_data.length; isld++) {
            let p1 = short_loop_data[isld].anchorage.p1;
            let p2 = short_loop_data[isld].anchorage.p2;
            let y_direction = 1;
            if (short_loop_data[isld].note === "Cytoplasmic") {
                y_direction = -1;
            }
            let points;
            if (loop_drawing_shape.type === "simple") {
                let x_skew_perc = 0.0;
                if (loop_drawing_shape.calc.hasOwnProperty("x_skew_perc")) {
                    x_skew_perc = loop_drawing_shape.calc.x_skew_perc;
                }
                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(short_loop_data[isld], loop_drawing_shape.calc.add_wave_fold);
                }
                points = generateSimpleLoopPoints(p1, p2, curve_height, y_direction, x_skew_perc, add_wavefold_obj);
            } else if (loop_drawing_shape.type === "swirl") {
                let swirl_x = loop_drawing_shape.calc.swirl_x;
                let perc_step_y = loop_drawing_shape.calc.perc_step_y;
                points = generateSwirlLoopPoints(p1, p2, swirl_x, curve_height, perc_step_y, y_direction);
            } else if (loop_drawing_shape.type === "bulb") {
                let perc_step_y = loop_drawing_shape.calc.perc_step_y;
                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(short_loop_data[isld], loop_drawing_shape.calc.add_wave_fold);
                }
                let x_skew_perc = 0.0;
                if (loop_drawing_shape.calc.hasOwnProperty("x_skew_perc")) {
                    x_skew_perc = loop_drawing_shape.calc.x_skew_perc;
                }
                points = generateBulbLoopPoints(p1, p2, curve_width, curve_height, perc_step_y, y_direction,x_skew_perc, add_wavefold_obj);
            } else if (loop_drawing_shape.type === "mushroom") {
                let perc_step_y1 = loop_drawing_shape.calc.perc_step_y1;
                let perc_step_y2 = loop_drawing_shape.calc.perc_step_y2;
                let perc_center_x = loop_drawing_shape.calc.perc_center_x;
                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(short_loop_data[isld], loop_drawing_shape.calc.add_wave_fold,x_skew_perc, add_wavefold_obj);
                }
                let x_skew_perc = 0.0;
                if (loop_drawing_shape.calc.hasOwnProperty("x_skew_perc")) {
                    x_skew_perc = loop_drawing_shape.calc.x_skew_perc;
                }
                points = generateMushRoomLoopPoints(p1,p2, curve_width, curve_height, perc_center_x, perc_step_y1, perc_step_y2, y_direction,x_skew_perc, add_wavefold_obj);
            }
            short_loop_data[isld].points = points;
        }
        return short_loop_data;
    }

    /**
     * Generate loop points for short and long loops of scaled y growth "step" sizes according to their aanumber
     * @namespace
     * @exports NaView
     * @name calculateScaledPointData 
     * @param {Array} short_loop_data array of short or long loop data generated by processRawUniProt
     * @param {Object} loop_length_calculation Object part of style_obj describing how loop length should be calculated
     * @param {Object} loop_drawing_shape Object part of style_obj describing which loop shape should be drawn
     * @yields {Array} array of short or long loop data generated by processRawUniProt with points describing loop added
     */
    function calculateScaledPointData(short_loop_data, loop_length_calculation, loop_drawing_shape) {
        let aa_num_sld_array = short_loop_data.map(function(a, i){
            return [a.aanum, i];
        });
        let sorted_aa_num_sld_array = aa_num_sld_array.sort(function(a,b){
            return b[0] - a[0];
        });
        //get: maximum residue number
        let max_aanum = sorted_aa_num_sld_array[0][0];
        let max_aanum_index = sorted_aa_num_sld_array[0][1];

        //get: neeeded variables for step scales to be generated
        let scale_vars = {};
        if (loop_drawing_shape.type === "simple") {
            scale_vars.y_step = {};
        } else if (loop_drawing_shape.type === "swirl") {
            scale_vars.y_step = {};
        } else if (loop_drawing_shape.type === "bulb") {
            scale_vars.y_step = {};
            scale_vars.x_step = {};
        } else if (loop_drawing_shape.type === "mushroom") {
            scale_vars.y_step = {};
            scale_vars.x_step = {};
        }

        //get: maximum possible height and width for a curve
        //get: corresponding maximum step for generating these dimensions
        let curve_maxheight;
        let curve_maxwidth;
        if (loop_drawing_shape.type === "simple") {
            curve_maxheight = svg_height * loop_length_calculation.calc.height;
            scale_vars.y_step.max_step = curve_maxheight / loop_drawing_shape.calc.y_step;
        } else if (loop_drawing_shape.type === "swirl") {
                curve_maxheight = svg_height * loop_length_calculation.calc.height;
                scale_vars.y_step.max_step = curve_maxheight / loop_drawing_shape.calc.y_step;
        } else if (loop_drawing_shape.type === "bulb") {
            curve_maxheight = svg_height * loop_length_calculation.calc.height;
            curve_maxwidth = svg_width * loop_length_calculation.calc.width;
            scale_vars.y_step.max_step = curve_maxheight / loop_drawing_shape.calc.y_step;
            scale_vars.x_step.max_step = curve_maxwidth / loop_drawing_shape.calc.x_step;
        } else if (loop_drawing_shape.type === "mushroom") {
            curve_maxheight = svg_height * loop_length_calculation.calc.height;
            curve_maxwidth = svg_width * loop_length_calculation.calc.width;
            scale_vars.y_step.max_step = curve_maxheight / loop_drawing_shape.calc.y_step;
            scale_vars.x_step.max_step = curve_maxwidth / loop_drawing_shape.calc.x_step;
        }
        //create: step scaling for each loop, based on their aanumber
        for (const scale_var in scale_vars) {
            if (scale_vars.hasOwnProperty(scale_var)) {
                scale_vars[scale_var]["scale"] = loop_length_calculation.calc.scale;
                scale_vars[scale_var]["domain"] = [1,max_aanum];
                scale_vars[scale_var]["range"] = [1, scale_vars[scale_var]["max_step"]];
            }
        }

        //for each loop: generate path with given scaling
        for (let isld = 0; isld < short_loop_data.length; isld++) {
            let p1 = short_loop_data[isld].anchorage.p1;
            let p2 = short_loop_data[isld].anchorage.p2;
            let y_direction = 1;
            if (short_loop_data[isld].note === "Cytoplasmic") {
                y_direction = -1;
            }
            let points;
            if (loop_drawing_shape.type === "simple") {
                let loop_scaling = makeLoopScaling(scale_vars.y_step, loop_length_calculation);
                let step_number = loop_scaling(short_loop_data[isld].aanum);
                let curve_height = (step_number * loop_drawing_shape.calc.y_step);
                let x_skew_perc = 0.0;
                if (loop_drawing_shape.calc.hasOwnProperty("x_skew_perc")) {
                    x_skew_perc = loop_drawing_shape.calc.x_skew_perc;
                }
                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(short_loop_data[isld], loop_drawing_shape.calc.add_wave_fold);
                }
                points = generateSimpleLoopPoints(p1, p2, curve_height, y_direction, x_skew_perc, add_wavefold_obj);
            } else if (loop_drawing_shape.type === "swirl") {
                let loop_scaling = makeLoopScaling(scale_vars.y_step, loop_length_calculation);
                let step_number = loop_scaling(short_loop_data[isld].aanum);
                let curve_height = (step_number * loop_drawing_shape.calc.y_step);
                let swirl_x = loop_drawing_shape.calc.swirl_x;
                let perc_step_y = loop_drawing_shape.calc.perc_step_y;
                points = generateSwirlLoopPoints(p1, p2, swirl_x, curve_height, perc_step_y, y_direction);
            } else if (loop_drawing_shape.type === "bulb") {
                let loop_scaling_y = makeLoopScaling(scale_vars.y_step, loop_length_calculation);
                let step_number_y = loop_scaling_y(short_loop_data[isld].aanum);
                let curve_height = (step_number_y * loop_drawing_shape.calc.y_step);

                let loop_scaling_x = makeLoopScaling(scale_vars.x_step, loop_length_calculation);
                let step_number_x = loop_scaling_x(short_loop_data[isld].aanum);
                let curve_width = (step_number_x * loop_drawing_shape.calc.x_step);// + short_loop_data[isld].anchorage.dist;

                let perc_step_y = loop_drawing_shape.calc.perc_step_y;

                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(short_loop_data[isld], loop_drawing_shape.calc.add_wave_fold);
                }
                let x_skew_perc = 0.0;
                if (loop_drawing_shape.calc.hasOwnProperty("x_skew_perc")) {
                    x_skew_perc = loop_drawing_shape.calc.x_skew_perc;
                }
                points = generateBulbLoopPoints(p1, p2, curve_width, curve_height, perc_step_y, y_direction,x_skew_perc, add_wavefold_obj);
            } else if (loop_drawing_shape.type === "mushroom") {
                let loop_scaling_y = makeLoopScaling(scale_vars.y_step, loop_length_calculation);
                let step_number_y = loop_scaling_y(short_loop_data[isld].aanum);
                let curve_height = (step_number_y * loop_drawing_shape.calc.y_step);

                let loop_scaling_x = makeLoopScaling(scale_vars.x_step, loop_length_calculation);
                let step_number_x = loop_scaling_x(short_loop_data[isld].aanum);
                let curve_width = (step_number_x * loop_drawing_shape.calc.x_step);// + short_loop_data[isld].anchorage.dist;

                let perc_step_y1 = loop_drawing_shape.calc.perc_step_y1;
                let perc_step_y2 = loop_drawing_shape.calc.perc_step_y2;
                let perc_center_x = loop_drawing_shape.calc.perc_center_x;

                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(short_loop_data[isld], loop_drawing_shape.calc.add_wave_fold);
                }
                let x_skew_perc = 0.0;
                if (loop_drawing_shape.calc.hasOwnProperty("x_skew_perc")) {
                    x_skew_perc = loop_drawing_shape.calc.x_skew_perc;
                }
                points = generateMushRoomLoopPoints(p1,p2, curve_width, curve_height, perc_center_x, perc_step_y1, perc_step_y2, y_direction,x_skew_perc, add_wavefold_obj);
            }
            short_loop_data[isld].points = points;
        }
        return short_loop_data;
    }

    /**
     * Iterates over multiple step sizes until loop of an expected length is generated for a given curve.
     * @namespace
     * @exports NaView
     * @name generatePathWithLength 
     * @param {Object} p1 starting point of curve
     * @param {Object} p2 end point of curve
     * @param {number} loop_length expected length of curve
     * @param {number} y_direction 1.0 or -1.0 indicating orientation of curve
     * @param {Object} loop_drawing_shape Object part of style_obj describing which loop shape should be drawn
     * @param {String} loop_drawing_shape_type String describing curve type according to style_obj
     * @param {Object} extra_variables dictionary containing extra style_obj parameters not included in shape
     * @param {Object} loop_data original loop data generated by processRawUniProt
     * @yields {Array} array of points describing curve of loop
     */
    function generatePathWithLength(p1,p2,loop_length,y_direction,loop_drawing_shape,loop_drawing_shape_type,extra_variables,loop_data) {
        let step_number = 1;
        let current_length = 0;
        let current_points;
        let x_skew_perc;
        if (extra_variables.hasOwnProperty("x_skew_perc")) {
            x_skew_perc = deepCopy(extra_variables["x_skew_perc"]);
        }
        while (loop_length > current_length) {
            if (loop_drawing_shape_type === "simple") {
                let curve_height = (step_number * extra_variables.y_step);
                let x_skew_perc = 0.0;
                if (loop_drawing_shape.calc.hasOwnProperty("x_skew_perc")) {
                    x_skew_perc = loop_drawing_shape.calc.x_skew_perc;
                }
                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(loop_data, loop_drawing_shape.calc.add_wave_fold);
                }
                current_points = generateSimpleLoopPoints(p1, p2, curve_height, y_direction, x_skew_perc, add_wavefold_obj);
            } else if (loop_drawing_shape_type === "swirl") {
                let curve_height = (step_number * extra_variables.y_step);
                let swirl_x = extra_variables.swirl_x;
                let perc_step_y = extra_variables.perc_step_y;
                current_points = generateSwirlLoopPoints(p1, p2, swirl_x, curve_height, perc_step_y, y_direction);
            } else if (loop_drawing_shape_type === "simple_skewed") {
                let curve_height = (step_number * extra_variables.y_step); 
                let perc_center_x = extra_variables.perc_center_x;
                current_points = generateSkewedSimpleLoopPoints(p1, p2, perc_center_x, curve_height, y_direction);
            } else if (loop_drawing_shape_type === "bulb") {
                let curve_height = (step_number * extra_variables.y_step); 
                let curve_width = (step_number * extra_variables.x_step);
                let perc_step_y = extra_variables.perc_step_y;
                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(loop_data, loop_drawing_shape.calc.add_wave_fold);
                }
                current_points = generateBulbLoopPoints(p1, p2, curve_width, curve_height, perc_step_y, y_direction,x_skew_perc, add_wavefold_obj);
            } else if (loop_drawing_shape_type === "mushroom") {
                let curve_height = (step_number * extra_variables.y_step); 
                let curve_width = (step_number * extra_variables.x_step);
                let perc_center_x = extra_variables.perc_center_x;
                let perc_step_y1 = extra_variables.perc_step_y1;
                let perc_step_y2 = extra_variables.perc_step_y2;
                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(loop_data, loop_drawing_shape.calc.add_wave_fold);
                }
                current_points = generateMushRoomLoopPoints(p1,p2, curve_width, curve_height, perc_center_x, perc_step_y1, perc_step_y2, y_direction,x_skew_perc, add_wavefold_obj);
            } else if (loop_drawing_shape_type === "n_curves") {
                let curve_height = (step_number * extra_variables.y_step);
                let n_centers = loop_drawing_shape.calc.n_centers;
                let perc_centers_height = loop_drawing_shape.calc.perc_centers_height;
                let loop_rotation = loop_drawing_shape.calc.loop_rotation;
                current_points = generateNWaveCurves(p1, p2, n_centers, curve_height, perc_centers_height, y_direction, loop_rotation);
            }
            let hasNaN = checkForNaN(current_points);
            if (hasNaN || current_points.length === 0) {
                return;
            }
            current_length = getGhostPathLength(current_points);
            step_number += 1;
        }
        // gname += 1;
        return current_points;
    }

    /**
     * Generate loop points for short and long loops of length according to the expected length of each aminoacid in style_obj.
     * @namespace
     * @exports NaView
     * @name calculateResLengthPointData 
     * @param {Array} short_loop_data array of short or long loop data generated by processRawUniProt
     * @param {Object} loop_length_calculation Object part of style_obj describing how loop length should be calculated
     * @param {Object} loop_drawing_shape Object part of style_obj describing which loop shape should be drawn
     * @yields {Array} array of short or long loop data generated by processRawUniProt with points describing loop added
     */
    function calculateResLengthPointData(short_loop_data, loop_length_calculation, loop_drawing_shape) {
        //if smaller than, refactor length
        let aa_dist_sld_aanum_array = short_loop_data.map(function(a, i){
            return [a.anchorage.dist, i, a.aanum];
        });
        let sorted_aa_dist_sld_array = aa_dist_sld_aanum_array.sort(function(a,b){
            return a[0] - b[0];
        });
        //get: minimum anchorage euclidean distance
        let min_dist = sorted_aa_dist_sld_array[0][0];
        let min_dist_index = sorted_aa_dist_sld_array[0][1];
        let min_dist_aanum = sorted_aa_dist_sld_array[0][2];

        let minimum_possible_reslen = min_dist/min_dist_aanum;
        let current_reslen = loop_length_calculation.calc.length;
        if (current_reslen < minimum_possible_reslen) {
            console.log("WARNING: Reslength is smaller than what is possible. Refactoring...")
            current_reslen = minimum_possible_reslen;
            loop_length_calculation.calc.length = minimum_possible_reslen;
        }

        let extra_variables = {};
        for (const k in loop_drawing_shape["calc"]) {
            if (loop_drawing_shape["calc"].hasOwnProperty(k)) {
                extra_variables[k] = loop_drawing_shape["calc"][k];
            }
        }
        for (let isld = 0; isld < short_loop_data.length; isld++) {
            let p1 = short_loop_data[isld].anchorage.p1;
            let p2 = short_loop_data[isld].anchorage.p2;
            let y_direction = 1;
            if (short_loop_data[isld].note === "Cytoplasmic") {
                y_direction = -1;
            }
            if (loop_drawing_shape.type === "n_curves") {
                y_direction = true;
            }
            let loop_length = short_loop_data[isld].aanum * current_reslen;
            let points = generatePathWithLength(p1,p2,loop_length,y_direction,loop_drawing_shape,loop_drawing_shape.type,extra_variables,short_loop_data[isld]);
            short_loop_data[isld].points = points;
        }
        return short_loop_data;
    }

    /**
     * Generate loop points for short and long loops of custom height and width according to style_obj
     * @namespace
     * @exports NaView
     * @name calculateCustomPointData 
     * @param {Array} short_loop_data array of short or long loop data generated by processRawUniProt
     * @param {Object} loop_length_calculation Object part of style_obj describing how loop length should be calculated
     * @param {Object} loop_drawing_shape Object part of style_obj describing which loop shape should be drawn
     * @yields {Array} array of short or long loop data generated by processRawUniProt with points describing loop added
     */
    function calculateCustomPointData(short_loop_data, loop_length_calculation, loop_drawing_shape) {
        for (let isld = 0; isld < short_loop_data.length; isld++) {
            let p1 = short_loop_data[isld].anchorage.p1;
            let p2 = short_loop_data[isld].anchorage.p2;
            let y_direction = 1;
            if (short_loop_data[isld].note === "Cytoplasmic") {
                y_direction = -1;
            }
            let curve_width;
            let curve_height;
            if (short_loop_data[isld].hasOwnProperty("dom_name")) {
                let dom_name = short_loop_data[isld].dom_name;
                let dom_itype = short_loop_data[isld].dom_itype;
                curve_width = loop_length_calculation["calc"]["width"][dom_name][dom_itype] *  svg_width;
                curve_height = loop_length_calculation["calc"]["height"][dom_name][dom_itype] * svg_height;
            } else {
                let dom_iname = short_loop_data[isld].dom_iname;
                curve_width = loop_length_calculation["calc"]["width"][dom_iname] *  svg_width;
                curve_height = loop_length_calculation["calc"]["height"][dom_iname] * svg_height;
            }
            let points;
            if (loop_drawing_shape.type === "simple") {
                let x_skew_perc = 0.0;
                if (loop_drawing_shape.calc.hasOwnProperty("x_skew_perc")) {
                    x_skew_perc = loop_drawing_shape.calc.x_skew_perc;
                }
                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(short_loop_data[isld], loop_drawing_shape.calc.add_wave_fold);
                }
                points = generateSimpleLoopPoints(p1, p2, curve_height, y_direction, x_skew_perc, add_wavefold_obj);
            } else if (loop_drawing_shape.type === "swirl") {
                let swirl_x = loop_drawing_shape.calc.swirl_x;
                let perc_step_y = loop_drawing_shape.calc.perc_step_y;
                points = generateSwirlLoopPoints(p1, p2, swirl_x, curve_height, perc_step_y, y_direction);
            } else if (loop_drawing_shape.type === "bulb") {
                let perc_step_y = loop_drawing_shape.calc.perc_step_y;
                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(short_loop_data[isld], loop_drawing_shape.calc.add_wave_fold);
                }
                let x_skew_perc = 0.0;
                if (loop_drawing_shape.calc.hasOwnProperty("x_skew_perc")) {
                    x_skew_perc = loop_drawing_shape.calc.x_skew_perc;
                }
                points = generateBulbLoopPoints(p1, p2, curve_width, curve_height, perc_step_y, y_direction, x_skew_perc, add_wavefold_obj);
            } else if (loop_drawing_shape.type === "mushroom") {
                let perc_step_y1 = loop_drawing_shape.calc.perc_step_y1;
                let perc_step_y2 = loop_drawing_shape.calc.perc_step_y2;
                let perc_center_x = loop_drawing_shape.calc.perc_center_x;
                let add_wavefold_obj;
                if (loop_drawing_shape.calc.hasOwnProperty("add_wave_fold")) {
                    add_wavefold_obj = checkWaveFold(short_loop_data[isld], loop_drawing_shape.calc.add_wave_fold);
                }
                let x_skew_perc = 0.0;
                if (loop_drawing_shape.calc.hasOwnProperty("x_skew_perc")) {
                    x_skew_perc = loop_drawing_shape.calc.x_skew_perc;
                }
                points = generateMushRoomLoopPoints(p1,p2, curve_width, curve_height, perc_center_x, perc_step_y1, perc_step_y2, y_direction, x_skew_perc, add_wavefold_obj);
            }
            short_loop_data[isld].points = points;
        }
        return short_loop_data;
    }

    /**
     * After loop parent elements are drawn and partitioned to individual aminoacid, appends centroid data for each aminoacid in loops.
     * @namespace
     * @exports NaView
     * @name gen_centroids_loop_paths_resids 
     * @param {String} given_class class which loop group elements were named
     */
    function gen_centroids_loop_paths_resids(given_class) {
        let created_paths = document.getElementsByClassName(given_class);
        for (let icp = 0; icp < created_paths.length; icp++) {
            const element = created_paths[icp];
            // let path_box = element.getBoundingClientRect();
            let path_box = element.getBBox();
            // let xCenter = (path_box.left + path_box.right) / 2;
            // let yCenter = (path_box.top + path_box.bottom) / 2;
            let xCenter = path_box.x + (path_box.width / 2) ;
            let yCenter = path_box.y + (path_box.height / 2) ;
            let new_datum = d3.select(element).datum();
            new_datum["centroid"] = [xCenter, yCenter];
            d3.select(element).datum(new_datum);
            // if (new_datum.res_ind === "NaN") {
            //     d3.select(element).remove();
            // }
        }
    }

    /**
     * Function to create loop path elements to each individual amino acid in loop by partitioning the parent loop element
     * @namespace
     * @exports NaView
     * @name draw_loop_paths_resids 
     * @param {D3 Selection} enter_element parent loop element d3.js selection
     * @param {String} class_naming class to name loop group elements
     */
    function draw_loop_paths_resids(enter_element, class_naming) {
        let curve = d3.line().curve(d3.curveNatural);
        let data = enter_element.datum();

        let identifier_1 = "dom_name";
        let identifier_2 = "dom_itype";
        if (data.hasOwnProperty(identifier_1) === false || !data[identifier_1]) {
            identifier_1 = "id";
            identifier_2 = "id";
        }

        let data_resids = data.resids;
        let g_short_loop_resids = enter_element.append("g")
        .attr("id", function(d){
            // return "g_"+class_naming+"_resids_" + d.dom_name + "_" + d.dom_itype;
            return "g_"+class_naming+"_resids_" + d[identifier_1] + "_" + d[identifier_2];
        })
        .attr("class", "g_"+class_naming+"_resids residue_path")
        // .attr("class", "g_"+class_naming+"_resids")
        // .style("display", "none")
        .style("visibility", "hidden")
        ;
        
        g_short_loop_resids.selectAll(+function(d) {
            // return "."+class_naming+"_resid_" + d.dom_name + "_" + d.dom_itype;
            return "."+class_naming+"_resid_" + d[identifier_1] + "_" + d[identifier_2];
        })
        .data(function(d) {
            let aa_array = d.aas.split('');
            let height_per_aa = d.draw_area.height / aa_array.length;
            let d_data = [];
            
            // let p_element = d3.select("#g_"+class_naming+"_" + d.dom_name + "_" + d.dom_itype);
            // let p_element = d3.select("#g_"+class_naming+"_" + d[identifier_1] + "_" + d[identifier_2]);
            // let p_length = p_element.node().getTotalLength();
            // let p_length_per_resid = p_length / data_resids.length;
            // let p_length_per_resid = document.getElementById("g_"+class_naming+"_" + d.dom_name + "_" + d.dom_itype).getTotalLength() / data_resids.length;
            // let p_length_per_resid = document.getElementById("g_"+class_naming+"_" + d.dom_name + "_" + d.dom_itype).getTotalLength() / d.resids.length;
            let path_resids_id_name = "g_"+class_naming+"_" + d[identifier_1] + "_" + d[identifier_2];
            let p_length_per_resid = document.getElementById(path_resids_id_name).getTotalLength() / d.resids.length;
            let segmentstart = 0;
            for (let iaaa = 0; iaaa < aa_array.length; iaaa++) {
                let aa = aa_array[iaaa];
                // segmentstart = segmentend + 0;
                segmentstart = p_length_per_resid*iaaa;
                let segmentend = segmentstart + p_length_per_resid;
                // let path_piece_pts = pathSegmentToXYPoints(document.getElementById("g_"+class_naming+"_" + d.dom_name + "_" + d.dom_itype), segmentstart, segmentend, 1);
                let path_piece_pts = pathSegmentToXYPoints(document.getElementById("g_"+class_naming+"_" + d[identifier_1] + "_" + d[identifier_2]), segmentstart, segmentend, 1);
                d_data.push({
                    "id": d.id,
                    "type":d.type,
                    "dom_name":d.dom_name,
                    "dom_itype":d.dom_itype,
                    "path_piece_pts":path_piece_pts,
                    "fill":data.fill,
                    "stroke":data.stroke,
                    "stroke_width":data.stroke_size,
                    "opacity":data.opacity,
                    "res_1":d.resids[iaaa].res_1,
                    "res_3":d.resids[iaaa].res_3,
                    "res_ind":d.resids[iaaa].res_ind,
                })
            }
            return d_data;
        })
        .join(
            function(enter) {
                let e2 = enter.append("path")
                // .attr("class", function(d) { return class_naming+"_resid_" + d.dom_name + "_" + d.dom_itype + " short_loops_residues"; })
                .attr("class", function(d) { return class_naming+"_resid_" + d[identifier_1] + "_" + d[identifier_2] + " "+class_naming+"_residues single_residue_path"; })
                .attr("resname", function(d){ return d.res_3+d.res_ind; })
                .attr("d", function(d) {
                    return curve(d.path_piece_pts);
                })
                .attr("stroke-width", function(d) { return d.stroke_width;})
                .attr("fill", function(d) {
                    // let f_color = checkFillResidue(d)[0];
                    // if (f_color) {
                    //     return f_color;
                    // }
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    let o_color = checkFillResidue(d)[1];
                    if (o_color) {
                        return o_color;;
                    }
                    return d["opacity"];
                })
                .attr("stroke", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d.stroke;
                })
                // .style("vector-effect", "non-scaling-stroke")
                .on("mouseover", function(d) {
                    console.log("");
                    console.log("#######");
                    console.log("MOUSE OVER PATH");
                    console.log("data:");
                    console.log(d);
                    console.log("#######");
                    console.log("");
                })
                ;
                gen_centroids_loop_paths_resids(class_naming+"_residues");
                return e2;
            },
            function(update) {
                return update
                .transition()
                .attr("fill", function(d) {
                    // let f_color = checkFillResidue(d)[0];
                    // if (f_color) {
                    //     return f_color;
                    // }
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    let o_color = checkFillResidue(d)[1];
                    if (o_color) {
                        return o_color;
                    }
                    return d["opacity"];
                })
                .attr("stroke", function(d) {
                    let f_color = checkFillResidue(d)[0];
                    if (f_color) {
                        return f_color;
                    }
                    return d.stroke;
                });
            },
        );
    }

    /**
     * Function responsible for drawing loop curves according to d3.curveNatural and points of each curve
     * @namespace
     * @exports NaView
     * @name draw_loop_paths 
     * @param {Array} short_loop_data  Array of loop data to draw
     * @param {String} class_naming class to name loop group elements
     */
    function draw_loop_paths(short_loop_data, class_naming) {
        let curve = d3.line().curve(d3.curveNatural);
        let svg_element = d3.select("#"+svg_id)
        .append("g")
        .attr("class", class_naming+"_group");

        svg_element.selectAll("."+class_naming)
        .data(short_loop_data)
        .join(
            function(enter) {
                let e = enter.append("g")
                .attr("class", class_naming + " element_path_group");

                let p = e.append("path")
                .attr("id", function(d){
                    let identifier_1 = "dom_name";
                    let identifier_2 = "dom_itype";
                    if (d.hasOwnProperty("dom_name") === false || !d["dom_name"]) {
                        identifier_1 = "id";
                        identifier_2 = "id";
                    }
                    // return "g_"+class_naming+"_" + d.dom_name + "_" + d.dom_itype;
                    return "g_"+class_naming+"_" + d[identifier_1] + "_" + d[identifier_2];
                })
                .attr("class", "element_path")
                .attr("d", function(d) {
                    return curve(d.points);
                })
                .attr('stroke', function(d) {
                    return d["stroke"];
                })
                .attr("fill", function(d) {
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    return d["opacity"];
                })
                .attr('stroke-width', function(d) {
                    return d["stroke_size"];
                })
                // .style("vector-effect", "non-scaling-stroke")
                ;
                draw_loop_paths_resids(e, class_naming);
                return e;
            },
            function(update) {
                return update;
            },
            function(exit) {
                return exit.remove();
            },
        )
        //here d3 is used for append data to each path of loop to be generated with curveNatural

        // for each loop:
        // call point generation function according to parameters
        // retrieve points
        // draw path according to configs
        // split path into sub paths of residues
    }

    /**
     * Function responsbile for controlling addition of points to termini data and drawing of termini curves
     * @namespace
     * @exports NaView
     * @name draw_shortLoops 
     * @param {Array} short_loop_data array of short or long loop data generated by processRawUniProt
     */
    function draw_shortLoops(short_loop_data) {
        let loop_length_calculation = style_obj.protein.short_loops_draw_opts.calc_len;
        let loop_drawing_shape = style_obj.protein.short_loops_draw_opts.shape;
        if (loop_length_calculation.type === "fixed") {
            short_loop_data = calculateFixedPointData(short_loop_data, loop_length_calculation, loop_drawing_shape);
        } else if (loop_length_calculation.type === "scaled") {
            short_loop_data = calculateScaledPointData(short_loop_data, loop_length_calculation, loop_drawing_shape);
        } else if (loop_length_calculation.type === "reslen") {
            short_loop_data = calculateResLengthPointData(short_loop_data, loop_length_calculation, loop_drawing_shape);
        } else if (loop_length_calculation.type === "custom") {
            short_loop_data = calculateCustomPointData(short_loop_data, loop_length_calculation, loop_drawing_shape);
        }
        draw_loop_paths(short_loop_data, "short_loops");
    }

    /**
     * Generate loop points for pore loops of fixed or custom (per style_obj) height and width
     * @namespace
     * @exports NaView
     * @name calculateFixedCustomPointDataPore 
     * @param {Array} pores_data array of pore loop data generated by processRawUniProt
     * @param {Object} loop_length_calculation Object part of style_obj describing how loop length should be calculated
     * @param {Object} loop_drawing_shape Object part of style_obj describing which loop shape should be drawn
     * @yields {Array} array of pore loop data generated by processRawUniProt with points describing loop added
     */
    function calculateFixedCustomPointDataPore(pores_data, loop_length_calculation, loop_drawing_shape) {
        for (let ipd = 0; ipd < pores_data.length; ipd++) {
            let dom_name = pores_data[ipd].dom_name;
            let dom_itype = pores_data[ipd].dom_itype;
            let p1 = pores_data[ipd].anchorage.p1;
            let p2 = pores_data[ipd].anchorage.p2;
            let y_direction = -1;
            
            let box_height = pores_data[ipd].draw_area.height;
            let curve_height;
            if (loop_length_calculation["calc"]["height"].constructor == Object) {
                curve_height = loop_length_calculation["calc"]["height"][dom_name][dom_itype] * box_height;
            } else {
                curve_height = loop_length_calculation["calc"]["height"] * box_height;
            }
            let points;
            let perc_center_x = loop_drawing_shape.calc.perc_center_x;
            points = generateSkewedSimpleLoopPoints(p1, p2, perc_center_x, curve_height, y_direction);
            pores_data[ipd].points = points;
        }
        return pores_data;
    }

    /**
     * Generate loop points for pore loops of scaled y growth "step" sizes according to their aanumber
     * @namespace
     * @exports NaView
     * @name calculateScaledPointDataPore 
     * @param {Array} pores_data array of pore loop data generated by processRawUniProt
     * @param {Object} loop_length_calculation Object part of style_obj describing how loop length should be calculated
     * @param {Object} loop_drawing_shape Object part of style_obj describing which loop shape should be drawn
     * @yields {Array} array of pore loop data generated by processRawUniProt with points describing loop added
     */
    function calculateScaledPointDataPore(pores_data, loop_length_calculation, loop_drawing_shape) {
        let aa_num_pore_array = pores_data.map(function(a, i){
            return [a.aanum, i, a.draw_area.height];
        });
        let sorted_aa_num_pore_array = aa_num_pore_array.sort(function(a,b){
            return b[0] - a[0];
        });

        //get: maximum residue number
        let max_aanum = sorted_aa_num_pore_array[0][0];
        let max_aanum_height = sorted_aa_num_pore_array[0][2];

        let curve_maxheight = max_aanum_height * loop_length_calculation.calc.height; 

        let scale_vars = {};
        scale_vars["y_step"] = {};
        scale_vars["y_step"]["max_step"] =  curve_maxheight / loop_drawing_shape.calc.y_step;
        scale_vars["y_step"]["scale"] = loop_length_calculation.calc.scale;
        scale_vars["y_step"]["domain"] = [1,max_aanum];
        scale_vars["y_step"]["range"] = [1,  curve_maxheight / loop_drawing_shape.calc.y_step];

        let loop_scaling = makeLoopScaling(scale_vars.y_step, loop_length_calculation);

        for (let ipd = 0; ipd < pores_data.length; ipd++) {
            let p1 = pores_data[ipd].anchorage.p1;
            let p2 = pores_data[ipd].anchorage.p2;
            let y_direction = -1;
            let points;
            let step_number = loop_scaling(pores_data[ipd].aanum);
            let curve_height = (step_number * loop_drawing_shape.calc.y_step);
            let perc_center_x = loop_drawing_shape.calc.perc_center_x;
            points = generateSkewedSimpleLoopPoints(p1, p2, perc_center_x, curve_height, y_direction);
            pores_data[ipd].points = points;
        }
        return pores_data;
    }

    /**
     * Generate loop points for pore loops of length according to the expected length of each aminoacid in style_obj.
     * @namespace
     * @exports NaView
     * @name calculateResLengthPointDataPore 
     * @param {Array} pores_data array of pore loop data generated by processRawUniProt
     * @param {Object} loop_length_calculation Object part of style_obj describing how loop length should be calculated
     * @param {Object} loop_drawing_shape Object part of style_obj describing which loop shape should be drawn
     * @yields {Array} array of pore loop data generated by processRawUniProt with points describing loop added
     */
    function calculateResLengthPointDataPore(pores_data, loop_length_calculation, loop_drawing_shape) {
        let aa_dist_sld_aanum_array = pores_data.map(function(a, i){
            return [a.anchorage.dist, i, a.aanum];
        });
        let sorted_aa_dist_sld_array = aa_dist_sld_aanum_array.sort(function(a,b){
            return a[0] - b[0];
        });
        //get: minimum anchorage euclidean distance
        let min_dist = sorted_aa_dist_sld_array[0][0];
        let min_dist_index = sorted_aa_dist_sld_array[0][1];
        let min_dist_aanum = sorted_aa_dist_sld_array[0][2];

        let minimum_possible_reslen = min_dist/min_dist_aanum;
        let current_reslen = loop_length_calculation.calc.length;
        if (current_reslen < minimum_possible_reslen) {
            console.log("WARNING: Reslength is smaller than what is possible. Refactoring...")
            current_reslen = minimum_possible_reslen;
            loop_length_calculation.calc.length = minimum_possible_reslen;
        }

        let extra_variables = {};
        for (const k in loop_drawing_shape["calc"]) {
            if (loop_drawing_shape["calc"].hasOwnProperty(k)) {
                extra_variables[k] = loop_drawing_shape["calc"][k];
            }
        }
        for (let ipd = 0; ipd < pores_data.length; ipd++) {
            let p1 = pores_data[ipd].anchorage.p1;
            let p2 = pores_data[ipd].anchorage.p2;
            let y_direction = -1;
            let loop_length = pores_data[ipd].aanum * current_reslen;
            let points = generatePathWithLength(p1,p2,loop_length,y_direction,loop_drawing_shape,loop_drawing_shape.type,extra_variables,pores_data[ipd]);
            pores_data[ipd].points = points;
        }
        return pores_data;
    }

    /**
     * Function responsbile for controlling addition of points to pore data and drawing of pore curves
     * @namespace
     * @exports NaView
     * @name draw_poreLoops 
     * @param {Array} pores_data array of pore loop data generated by processRawUniProt
     */
    function draw_poreLoops(pores_data) {
        // pore drawing. pain in the arse. basically can be scaled alongside helix height
        // can have a custom breakpoint residue
        // and can be scaled according to a custom residue length

        let loop_length_calculation = style_obj.protein.pore_loops_draw_opts.calc_len;
        let loop_drawing_shape = style_obj.protein.pore_loops_draw_opts.shape;
        if (loop_length_calculation.type === "fixed" || loop_length_calculation.type === "custom") {
            pores_data = calculateFixedCustomPointDataPore(pores_data, loop_length_calculation, loop_drawing_shape)
        } else if (loop_length_calculation.type === "scaled") {
            pores_data = calculateScaledPointDataPore(pores_data, loop_length_calculation, loop_drawing_shape);
        } else if (loop_length_calculation.type === "reslen") {
            pores_data = calculateResLengthPointDataPore(pores_data, loop_length_calculation, loop_drawing_shape);
        }
        draw_loop_paths(pores_data, "pore_loops");
    }

    /**
     * Function responsbile for controlling addition of points to long loops data and drawing of long loops curves
     * @namespace
     * @exports NaView
     * @name draw_longLoops 
     * @param {Array} longloop_data  array of long loop data generated by processRawUniProt
     */
    function draw_longLoops(longloop_data) {
        let loop_length_calculation = style_obj.protein.long_loops_draw_opts.calc_len;
        let loop_drawing_shape = style_obj.protein.long_loops_draw_opts.shape;
        if (loop_length_calculation.type === "fixed") {
            longloop_data = calculateFixedPointData(longloop_data, loop_length_calculation, loop_drawing_shape);
        } else if (loop_length_calculation.type === "scaled") {
            longloop_data = calculateScaledPointData(longloop_data, loop_length_calculation, loop_drawing_shape);
        } else if (loop_length_calculation.type === "reslen") {
            longloop_data = calculateResLengthPointData(longloop_data, loop_length_calculation, loop_drawing_shape);
        } else if (loop_length_calculation.type === "custom") {
            longloop_data = calculateCustomPointData(longloop_data, loop_length_calculation, loop_drawing_shape);
        }
        draw_loop_paths(longloop_data, "long_loops");
    }

    /**
     * Generate loop points for termini loops of fixed or custom (per style_obj) height and width
     * @namespace
     * @exports NaView
     * @name calculateFixedPointTermini 
     * @param {Object} termini_data termini loop data Object generated by processRawUniProt
     * @param {Object} loop_length_calculation Object part of style_obj describing how loop length should be calculated
     * @param {Object} loop_drawing_shape Object part of style_obj describing which loop shape should be drawn
     * @yields {Object} termini loop data Object generated by processRawUniProt with points describing loop added
     */
    function calculateFixedPointTermini(termini_data, loop_length_calculation, loop_drawing_shape) {
        let termini_height;
        if (termini_data.terminus_type === "N") {
            termini_height = svg_drawarea.end_y - svg_drawarea.membrane_end;
        } else {
            termini_height = svg_drawarea.end_y - svg_drawarea.membrane_end;
        }
        let curve_height = termini_height * loop_length_calculation.calc.height;
        let p1 = termini_data.anchorage.p1;
        let p2 = termini_data.anchorage.p2;
        let starting_y_direction = true;
        let points;
        if (loop_drawing_shape.type === "n_curves") {
            let n_centers = loop_drawing_shape.calc.n_centers;
            let perc_centers_height = loop_drawing_shape.calc.perc_centers_height;
            let loop_rotation = loop_drawing_shape.calc.loop_rotation;
            points = generateNWaveCurves(p1, p2, n_centers, curve_height, perc_centers_height, starting_y_direction, loop_rotation);
        }
        termini_data.points = points;
        draw_loop_paths([termini_data], termini_data.terminus_type+"ter_loops");
        return termini_data;
    }

    /**
     * Function responsbile for controlling addition of points to termini data and drawing of termini curves
     * @namespace
     * @exports NaView
     * @name draw_termini 
     * @param {Object} termini_data termini loop data Object generated by processRawUniProt
     */
    function draw_termini(termini_data) {
        let loop_length_calculation;// = style_obj.protein.pore_loops_draw_opts.calc_len;
        let loop_drawing_shape;// = style_obj.protein.pore_loops_draw_opts.shape;
        if (termini_data.terminus_type === "N") {
            loop_length_calculation = style_obj.protein.nter_loop_draw_opts.calc_len;
            loop_drawing_shape = style_obj.protein.nter_loop_draw_opts.shape;
        } else {
            loop_length_calculation = style_obj.protein.cter_loop_draw_opts.calc_len;
            loop_drawing_shape = style_obj.protein.cter_loop_draw_opts.shape;
        }
        if (loop_length_calculation.type === "fixed") {
            termini_data = calculateFixedPointTermini(termini_data, loop_length_calculation, loop_drawing_shape);
        } else if (loop_length_calculation.type === "reslen") {
            termini_data = calculateResLengthPointData([termini_data], loop_length_calculation, loop_drawing_shape);
            draw_loop_paths(termini_data, termini_data[0].terminus_type+"ter_loops");
        }
    }
    
    /**
     * Function to parse residue relations description array and style_obj, generating points, width and color scales to each relation object.<br>
     * Relations between any residues or drawn elements follows the below syntax:<br>
     * {<br>
     *     "source":"random_residue_source", //index OR residue_name+index of residue in relationship or valid element name such as: "DomainI;Helix1"<br>
     *     "target":"random_residue_target", //index OR residue_name+index of residue in relationship or valid element name such as: "DomainI;Helix1"<br>
     *     "raw_weight":possibly_random_residue_weight //number indicating strength of each residue or element relationship<br>
     *     "type": "type" //optional type object for describing multiple types of relationships in plor<br>
     * }<br>
     * @see allowed_element_names
     * @see draw_relation_paths
     * @see whereIsResIdElName
     * @namespace
     * @exports NaView
     * @name draw_residue_relations 
     * @param {Array} residue_relation_data array of residue relation Objects
     * @param {Object} centroid_data Dictionary containing centroids of elements and residues
     * @param {Object} full_protein_data full data generated by processRawUniProt
     */
    function draw_residue_relations(residue_relation_data, centroid_data, full_protein_data) {
        let draw_opts = style_obj.protein.residue_relations_draw_opts;
        let group_weights_by_type;
        if (draw_opts.path_width_scaling.type === "calc") {
            group_weights_by_type = draw_opts.path_width_scaling.group_by_type;
        }
    
        residue_relation_data = mergeDrawData("residue_relations", deepCopy(residue_relation_data));
    
        let list_of_types = [];
        let total_weights_by_type = {};
        if (group_weights_by_type) {
            list_of_types = residue_relation_data.map(function(a) {
                total_weights_by_type[a.type] = 0;
                return a.type;
            });
            list_of_types = deepCopy(list_of_types).filter(onlyUnique);
        }
    
        let total_weights = residue_relation_data.reduce(function(r, a) {
            return r + a.raw_weight;
        }, 0);
        if (group_weights_by_type) {
            for (let irrd = 0; irrd < residue_relation_data.length; irrd++) {
                total_weights_by_type[residue_relation_data[irrd]["type"]] += residue_relation_data[irrd]["raw_weight"];
            }
        }
    
    
        let all_relative_weights = [];
        let all_absolute_weights = [];
        let all_relative_weights_by_type = {};
        let all_absolute_weights_by_type = {};
        for (let irrd = 0; irrd < residue_relation_data.length; irrd++) {
            residue_relation_data[irrd]["absolute_weight"] = residue_relation_data[irrd]["raw_weight"];
            if (group_weights_by_type) {
                residue_relation_data[irrd]["relative_weight"] = residue_relation_data[irrd]["raw_weight"] / total_weights_by_type[residue_relation_data[irrd]["type"]];
                if (all_relative_weights_by_type.hasOwnProperty(residue_relation_data[irrd]["type"]) === false) {
                    all_relative_weights_by_type[residue_relation_data[irrd]["type"]] = [];
                }
                all_relative_weights_by_type[residue_relation_data[irrd]["type"]].push(residue_relation_data[irrd]["relative_weight"]);
                if (all_absolute_weights_by_type.hasOwnProperty(residue_relation_data[irrd]["type"]) === false) {
                    all_absolute_weights_by_type[residue_relation_data[irrd]["type"]] = [];
                }
                all_absolute_weights_by_type[residue_relation_data[irrd]["type"]].push(residue_relation_data[irrd]["absolute_weight"]);
            } else {
                residue_relation_data[irrd]["relative_weight"] = residue_relation_data[irrd]["raw_weight"] / total_weights;        
            }
            all_absolute_weights.push(residue_relation_data[irrd]["absolute_weight"]);
            all_relative_weights.push(residue_relation_data[irrd]["relative_weight"]);
        }
        // let all_relative_weights = residue_relation_data.map(function(a) {
        //     return a.relative_weight;
        // });
        // let all_absolute_weights = residue_relation_data.map(function(a) {
        //     return a.raw_weight;
        // });
    
        let to_use_weights = deepCopy(all_relative_weights);
        let to_use_weights_by_type = deepCopy(all_relative_weights_by_type);
        if (draw_opts.weight_scaling === "absolute") {
            to_use_weights = all_absolute_weights;
            to_use_weights_by_type = deepCopy(all_absolute_weights_by_type);
        }
    
        let current_width_scale;
        if (draw_opts.path_width_scaling.type === "calc") {
            let wdomain = draw_opts.path_width_scaling.domain;
            let wrange = draw_opts.path_width_scaling.range;
    
            if (group_weights_by_type) {
                current_width_scale = function(etc, etctype) {
                    let cwdomain = deepCopy(wdomain);
                    if (cwdomain[0] === "min") {
                        cwdomain[0] = d3.min(to_use_weights_by_type[etctype]);
                    }
                    if (cwdomain[1] === "max") {
                        cwdomain[1] = d3.max(to_use_weights_by_type[etctype]);
                    }
                    let cwrange = deepCopy(wrange);
                    let sc = d3.scaleLinear()
                    .domain(cwdomain)
                    .range(cwrange);
                    return sc(etc);
                }
            } else {
                if (wdomain[0] === "min") {
                    wdomain[0] = d3.min(to_use_weights);
                }
                if (wdomain[1] === "max") {
                    wdomain[1] = d3.max(to_use_weights);
                }
    
                current_width_scale = d3.scaleLinear()
                .domain(wdomain)
                .range(wrange);
            }
            // console.log(current_width_scale)
        } else if (draw_opts.path_width_scaling.type === "fixed") {
            current_width_scale = function(etc) {
                return svg_width * draw_opts.path_width_scaling.perc_x;
            };
        } else {
            current_width_scale = function(etc) {
                return 0;
            };
        }
        let current_color_scale;
        let current_color_scale_prop;
        let lighter_fill_scale = draw_opts.color_scaling.lighter_fill;
        if (draw_opts.color_scaling.type === "calc") {
            if (draw_opts.color_scaling.property === "weight") {
                current_color_scale_prop = draw_opts.weight_scaling + "_" + draw_opts.color_scaling.property;
                let cdomain = draw_opts.color_scaling.domain;
                if (cdomain[0] === "min") {
                    cdomain[0] = d3.min(to_use_weights);
                }
                if (cdomain[1] === "max") {
                    cdomain[1] = d3.max(to_use_weights);
                }
                let crange = draw_opts.color_scaling.range;
                current_color_scale= d3.scaleLinear()
                .domain(cdomain)
                .range(crange);
            } else if (draw_opts.color_scaling.property === "type") {
                current_color_scale_prop = draw_opts.color_scaling.property;
                let cdomain = draw_opts.color_scaling.domain;
                let crange = draw_opts.color_scaling.range;
                // current_color_scale= d3.scaleLinear()
                // .domain(cdomain)
                // .range(crange);
                current_color_scale = function(etc) {
                    return crange[cdomain.indexOf(etc)];
                }
            }
        }
        // color_scaling
        // property
        
        let current_centroid_radius;
        if (draw_opts.element_centroid_scaling.type === "fixed") {
            current_centroid_radius = draw_opts.element_centroid_scaling.radius;
        }
    
        let test_relation_circle_data = [];
        for (let irrd = 0; irrd < residue_relation_data.length; irrd++) {
            let raw_relation = residue_relation_data[irrd];
    
            //TODO: test check for elements
            //TODO: check for stretches of residues
            let source_txt = raw_relation["source"];
            let target_txt = raw_relation["target"];
    
            let source_idx = source_txt;
            let target_idx = target_txt;
    
            let source_resel = whereIsResIdElName(source_idx,full_protein_data);
            let target_resel = whereIsResIdElName(target_idx,full_protein_data);
    
            let source_centroid = centroid_data[source_idx].point;
            let target_centroid = centroid_data[target_idx].point;
    
            let before_source = [];
            let after_target = [];
            // let source_idx_str = source_idx+"";
            // let target_idx_str = target_idx+"";
            // if (source_idx_str.includes(";") && current_centroid_radius) {
            //     console.log("source is element");
            //     let before_centroids_vector = createVector(source_centroid, target_centroid);
            //     let before_centroids_vector_normalized = normalizeVector(before_centroids_vector);
            //     let before_centroids_vector_scaled = scaleVector(before_centroids_vector_normalized, current_centroid_radius);
            //     let before_centroids_vector_rotated_1 = rotateByAng(before_centroids_vector_scaled, source_centroid, 90);
            //     let before_centroids_vector_rotated_2 = rotateByAng(before_centroids_vector_scaled, source_centroid, -90);
            //     before_source.push(before_centroids_vector_rotated_1);
            //     before_source.push(before_centroids_vector_rotated_2);
            // }
            // if (target_idx_str.includes(";") && current_centroid_radius) {
            //     console.log("target is element");
            //     let after_centroids_vector = createVector(source_centroid, target_centroid);
            //     let after_centroids_vector_normalized = normalizeVector(after_centroids_vector);
            //     let after_centroids_vector_scaled = scaleVector(after_centroids_vector_normalized, current_centroid_radius);
            //     let after_centroids_vector_rotated_1 = rotateByAng(after_centroids_vector_scaled, target_centroid, 90);
            //     let after_centroids_vector_rotated_2 = rotateByAng(after_centroids_vector_scaled, target_centroid, -90);
            //     after_target.push(after_centroids_vector_rotated_1);
            //     after_target.push(after_centroids_vector_rotated_2);
            // }
    
            let between_centroid = [];
            let after_centroid = [];
    
            let value_height = residue_relation_data[irrd]["relative_weight"];
            if (draw_opts.weight_scaling === "absolute") {
                value_height = residue_relation_data[irrd]["absolute_weight"];
            }
            let centroid_height;
            if (group_weights_by_type) {
                centroid_height = current_width_scale(value_height, residue_relation_data[irrd]["type"]);
            } else {
                centroid_height = current_width_scale(value_height);
            }
    
            let mid_point = calculateDotArrayMiddlePoint(source_centroid, target_centroid);
    
            if (draw_opts.centroid_pos.type === "fixed") {
                if (draw_opts.centroid_pos.perc_y !== "between") {
                    let between_centroid_y = svg_height * draw_opts.centroid_pos.perc_y;
                    mid_point[1] = between_centroid_y;
                    // console.log("between_centroid_y");
                    // console.log(between_centroid_y);
                }
                if (draw_opts.centroid_pos.perc_x !== "between") {
                    let between_centroid_x = svg_width * draw_opts.centroid_pos.perc_x;
                    mid_point[0] = between_centroid_x;
                }
            } else {
                let source_resel_type = "extracellular";
                if (source_resel.type === "helix" || source_resel.type === "pore")  {
                    source_resel_type = "intramembrane";
                } else if (source_resel.type === "loop" && source_resel.draw_area.start_y > (svg_height/2)) {
                    source_resel_type = "intracellular";
                }
                let target_resel_type = "extracellular";
                if (target_resel.type === "helix" || target_resel.type === "pore")  {
                    target_resel_type = "intramembrane";
                } else if (target_resel.type === "loop" && target_resel.draw_area.start_y > (svg_height/2)) {
                    target_resel_type = "intracellular";
                }
                let perc_dict = draw_opts["centroid_pos"]["perc_dict"][source_resel_type][target_resel_type];
                if (perc_dict["perc_y"] !== "between") {
                    let between_centroid_y = svg_height * perc_dict["perc_y"];
                    mid_point[1] = between_centroid_y;
                }
                if (perc_dict["perc_x"] !== "between") {
                    let between_centroid_x = svg_width * perc_dict["perc_x"]
                    mid_point[0] = between_centroid_x;
                }
                between_centroid = [mid_point];
            }
            // let between_centroids_vector = createVector(source_centroid, target_centroid);
            // console.log("centroid_height");
            // console.log(centroid_height);
            if (centroid_height > 0) {
                let between_centroids_vector = createVector(source_centroid, target_centroid);
                let between_centroids_vector_normalized = normalizeVector(between_centroids_vector);
                let between_centroids_vector_scaled = scaleVector(between_centroids_vector_normalized, centroid_height);
                let between_centroids_vector_rotated_1 = rotateByAng(between_centroids_vector_scaled, mid_point, 90);
                let between_centroids_vector_rotated_2 = rotateByAng(between_centroids_vector_scaled, mid_point, -90);
                between_centroid = [between_centroids_vector_rotated_1];
                after_centroid = [between_centroids_vector_rotated_2];
            }
    
            let points = [];
            // if (before_source.length > 0) {
            //     points.push(...before_source);
            // }
            points.push(source_centroid);
            points.push(...between_centroid);
            points.push(target_centroid);
            // if (after_target.length > 0) {
            //     points.push(...after_target);
            //     points.push(target_centroid);
            // }
            if (after_centroid.length > 0) {
                points.push(...after_centroid);
                points.push(source_centroid);
            }
            // if (before_source.length > 0) {
            //     points.push(before_source[0]);
            // }
            for (let ip = 0; ip < points.length; ip++) {
                let f = "blue";
                test_relation_circle_data.push({
                    "point": points[ip],
                    "fill": f,
                    "stroke": "yellow",
                    "stroke_size": "1px",
                    "opacity": "1",
                    "circle_radius": "4px",
                });
                
            }
    
            residue_relation_data[irrd]["source_resid"] = raw_relation["source"];
            residue_relation_data[irrd]["target_resid"] = raw_relation["target"];
            residue_relation_data[irrd]["points"] = deepCopy(points);
            if (current_color_scale) {
                let to_fill = current_color_scale(residue_relation_data[irrd][current_color_scale_prop]);
                if (lighter_fill_scale) {
                    to_fill = "rgba(" + colorToRGBA(to_fill) + ")";
                    to_fill = pSBC(0.20,to_fill);
                }
                residue_relation_data[irrd]["fill"] = to_fill;
                residue_relation_data[irrd]["stroke"] = current_color_scale(residue_relation_data[irrd][current_color_scale_prop]);
            }
    
        }
        // plotDotsCircles(test_relation_circle_data, "test_relation_circle_g", "test_relation_circle")
        draw_relation_paths(residue_relation_data);
    }

    /**
     * Searches for residue/element data in processRawUniProt generated data
     * @namespace
     * @exports NaView
     * @name whereIsResIdElName 
     * @param {String} resid_or_elname String containing name of a given residue/element
     * @param {Object} full_protein_data full data generated by processRawUniProt
     * @yields {Object} fresidue/element data of String containing name of a given residue/element
     */
    function whereIsResIdElName(resid_or_elname, full_protein_data) {
        // parsed_protein_data
        let resid_or_elname_str = resid_or_elname + "";
        let keywords = ["Domain", "InterDomain"];
        let filtered;
        if (resid_or_elname_str.includes(keywords[0]) === false && resid_or_elname_str.includes(keywords[1]) === false ) {
            filtered = deepCopy(full_protein_data).filter(function(a) {
                return a.start <= resid_or_elname && a.end >= resid_or_elname;
            });
        } else if (resid_or_elname_str.includes(keywords[1]) === true) {
            let interdomainindex = parseInt(resid_or_elname.split("InterDomain")[1].split(";")[0]);
            filtered = deepCopy(full_protein_data).filter(function(a) {
                return a.dom_iname === interdomainindex;
            });
        } else if (resid_or_elname_str.includes(keywords[0]) === true) {
            let domain_name = resid_or_elname.split("Domain")[1].split(";")[0];
            let el_type = resid_or_elname.split(";")[1];
            if (el_type === "Pore") {
                el_type = el_type.toLowerCase();
                filtered = deepCopy(full_protein_data).filter(function(a) {
                    return a.dom_name === domain_name && a.type === el_type; 
                });
            } else {
                let index_search = parseInt(el_type.split("")[el_type.length-1]);
                el_type = el_type.slice(0, el_type.length-1);
                el_type = el_type.toLowerCase();
                filtered = deepCopy(full_protein_data).filter(function(a) {
                    return a.dom_name === domain_name && a.type === el_type && a.dom_itype === index_search; 
                });
            }
        }
        return filtered[0];
    }

    /**
     * Plots paths indicating residue/element relationships
     * @namespace
     * @exports NaView
     * @name draw_relation_paths 
     * @param {Array} residue_relation_data array of parsed residue relation Objects
     */
    function draw_relation_paths(residue_relation_data) {
        // let curveN = d3.line().curve(d3.curveNatural);
        let curveN = d3.line().curve(d3.curveCatmullRom);
        // let curveN = d3.line().curve(d3.curveBasis);
        let svg_element = d3.select("#"+svg_id)
        .append("g")
        .attr("class", "relations_group");
    
        svg_element.selectAll(".relation_paths_g")
        .data(residue_relation_data)
        .join(
            function(enter) {
                let e = enter.append("g")
                .attr("class", "relation_paths_g");
    
                let p = e.append("path")
                .attr("id", function(d){
                    return d.source_resid + "_" + d.target_resid;
                })
                .attr("class", "relation_path")
                .attr("d", function(d) {
                    return curveN(d.points);
                })
                .attr('stroke', function(d) {
                    return d["stroke"];
                })
                .attr("fill", function(d) {
                    return d["fill"];
                } )
                .attr("opacity", function(d) {
                    return d["opacity"];
                })
                .attr('stroke-width', function(d) {
                    return d["stroke_size"];
                });
                
                return e;
            },
            function(update) {
                return update;
            },
            function(exit) {
                return exit.remove();
            },
        )
    }

    /**
     * Generates text data based on text plotting rules syntax.<br>
     * Text data object syntax examples:<br>
     * {<br>
     *  "text": "text to be drawn" //text to be drawn<br>
     *  "positioning": {<br>
     *     "type": "absolute" //for specific text drawing coordinates<br>
     *     "x": number //x positioning on svg<br>
     *     "y": number //y positioning on svg<br>
     *     },<br>
     *  "fill": "text color" //text color. when absent, defaults froms style object are used<br>
     *  "font_style": "normal" //normal, italic or bold. when absent, defaults froms style object are used<br>
     *  "font_size": number //size of font. when absent, defaults froms style object are used<br>
     *  "font_family": Arial //font family. when absent, defaults froms style object are used<br>
     * }<br>
     * <br>
     * positioning anchored to a given residue/protein element is also possible:<br>
     * <br>
     * {<br>
     *  "text": "text to be drawn" //text to be drawn<br>
     *  "positioning": {<br>
     *     "type": "residue_or_element" //for text drawing coordinates centered to an element selection<br>
     *     "reference": 5 // examples include: 5, W5, DomainI;Helix4, and all possible objects with a centroid<br>
     *     "dx": number // optional: number of pixels to move from reference centroid in the horizontal axis<br>
     *     "dy": number // optional: number of pixels to move from reference centroid in the vertical axis<br>
     *      }<br>
     *  ...<br>
     * }<br>
     * drawing a residue name, id and properties is also possible when reference indicates a residue:<br>
     * {<br>
     *  "props": ["residue_attribute", "random_string", "residue_property"]<br>
     *  "positioning": {<br><br>
     *     "type": "residue_or_element" //for text drawing coordinates centered to an element selection<br>
     *     "reference": 5<br>
     *      ...<br>
     *   }<br>
     *  ...<br>
     * }<br>
     * residue properties include one and three letter names ("res_1" and "res_3"), residue index in protein ("res_ind")<br>
     * random strings such as ",", "  ", ": " are summed to attributes and properties<br>
     * @see convertToResInd
     * @see whereIsResIdElName
     * @see draw_text_symbols
     * @namespace
     * @exports NaView
     * @name draw_symbols 
     * @param {Array} symbols_data array of objects including text data to be drawn
     * @param {Object} centroid_data dictionary of valid residue indexes and protein element names
     * @param {Object} property_data dictionary of properties per each valid residue indexes
     * @param {Ibject} full_protein_data parsed protein data generated from processRawUniProt
     */
    function draw_symbols(symbols_data, centroid_data,property_data, full_protein_data) {
        for (let isd = 0; isd < symbols_data.length; isd++) {
            if (symbols_data[isd].hasOwnProperty("font_family") === false) {
                symbols_data[isd]["font_family"] = style_obj.text_defs.font_family;
            }
            if (symbols_data[isd].hasOwnProperty("font_style") === false) {
                symbols_data[isd]["font_style"] = style_obj.text_defs.font_style;
            }
            if (symbols_data[isd].hasOwnProperty("font_size") === false) {
                symbols_data[isd]["font_size"] = style_obj.text_defs.font_size;
            }
            if (symbols_data[isd].hasOwnProperty("fill") === false) {
                symbols_data[isd]["fill"] = style_obj.text_defs.fill;
            }
            //pre calc element width and height for collision checking
            let symbol_bbox = getBBoxGhostText(symbols_data[isd]);
            if (symbols_data[isd].positioning.type === "absolute") {
                symbols_data[isd]["tdx"] = symbols_data[isd].positioning.x;
                symbols_data[isd]["tdy"] = symbols_data[isd].positioning.y;
                symbols_data[isd]["x"] = symbols_data[isd].positioning.x;
                symbols_data[isd]["y"] = symbols_data[isd].positioning.y;
            } else if (symbols_data[isd].positioning.type === "residue_or_element") {
            // } else {
                //get anchoring element centroid and append it
                let obj_index = convertToResInd(symbols_data[isd].positioning.reference);
                // let target_resel = whereIsResIdElName(obj_index,full_protein_data);
                obj_index = obj_index[0];
                let target_centroid = centroid_data[obj_index].point;
                symbols_data[isd]["tdx"] = target_centroid[0];
                symbols_data[isd]["tdy"] = target_centroid[1];
                symbols_data[isd]["x"] = target_centroid[0];
                symbols_data[isd]["y"] = target_centroid[1];
            // }
            } else if (symbols_data[isd].positioning.type === "residue_relation") {
                //TODO: Allow anchoring on residue relation?
            }
            //centering element
            if (style_obj.text_defs.center_xy) {
                symbols_data[isd]["tdx"] -= symbol_bbox.width/2;
                symbols_data[isd]["tdy"] -= symbol_bbox.height/2;
                symbols_data[isd]["x"] -= symbol_bbox.width/2;
                symbols_data[isd]["y"] -= symbol_bbox.height/2;
            }
            if (symbols_data[isd].positioning.hasOwnProperty("dx") === true) {
                symbols_data[isd]["tdx"] += symbols_data[isd].positioning.dx;
                symbols_data[isd]["x"] += symbols_data[isd].positioning.dx;
            }
            if (symbols_data[isd].positioning.hasOwnProperty("dy") === true) {
                symbols_data[isd]["tdy"] += symbols_data[isd].positioning.dy;
                symbols_data[isd]["y"] += symbols_data[isd].positioning.dy;
            }
            let current_draw_area = {
                "start_x":symbols_data[isd]["x"],
                "start_y":symbols_data[isd]["y"],
                "centroid": [symbols_data[isd]["x"]+(symbol_bbox.width/2),symbols_data[isd]["y"]+(symbol_bbox.height/2)],
                "end_x":symbols_data[isd]["x"]+symbol_bbox.width,
                "end_y":symbols_data[isd]["y"]+symbol_bbox.height,
                "width":symbol_bbox.width,
                "height":symbol_bbox.height,
            };
            if (symbols_data[isd].hasOwnProperty("text") === false && symbols_data[isd].hasOwnProperty("props") === true && symbols_data[isd].positioning.type !== "residue_relation") {
                let to_text = "";
    
                let obj_index = convertToResInd(symbols_data[isd].positioning.reference);
                obj_index = obj_index[0];
                let target_data = whereIsResIdElName(symbols_data[isd].positioning.reference,full_protein_data);
                
                let target_data_keys = Object.keys(target_data);
                let centroid_data_keys = Object.keys(centroid_data[obj_index]);
                let property_data_keys = Object.keys(property_data[obj_index]);
    
                for (let iprop = 0; iprop < symbols_data[isd]["props"].length; iprop++) {
                    let prop = symbols_data[isd]["props"][iprop];
                    if (target_data_keys.indexOf(prop) > -1) {
                        to_text += target_data[prop];
                    } else if (centroid_data_keys.indexOf(prop) > -1) {
                        to_text += centroid_data[obj_index][prop];
                    } else if (property_data_keys.indexOf(prop) > -1) {
                        to_text += property_data[obj_index][prop];
                    } else {
                        to_text += prop;
                    }
                }
                symbols_data[isd]["text"] = to_text;
            }
            // else if (symbols_data[isd].hasOwnProperty("text") === false && symbols_data[isd].hasOwnProperty("props") === true && symbols_data[isd].positioning.type === "residue_relation") {
            // }            
            symbols_data[isd]["draw_area"] = current_draw_area;
        }
        draw_text_symbols(symbols_data);
    }

    /**
     * Generates text elements with attributes embedded in data array
     * @namespace
     * @exports NaView
     * @name draw_text_symbols 
     * @param {Array} symbols_data array of objects including text data to be drawn
     */
    function draw_text_symbols(symbols_data) {
        let svg_element = d3.select("#"+svg_id)
        .append("g")
        .attr("class", "text_symbols_group");

        svg_element.selectAll(".text_symbols_g")
        .data(symbols_data)
        .join(
            function(enter) {
                let e = enter.append("g")
                .attr("class", "text_symbols_g");

                let p = e.append("text")
                .attr("id", function(d, i){
                    return "text_symbol_" + i;
                })
                .attr("class", "text_symbols_el")
                .attr("fill", function(d) {
                    return d["fill"];
                } )
                // .attr("font", function(d) {
                //     return d["font"];
                // })
                .attr("font-style", function(d) {
                    return d["font_style"];
                })
                .attr("font-family", function(d) {
                    return d["font_family"];
                })
                .attr("font-size", function(d) {
                    return d["font_size"];
                })
                .text(function(d) {
                    return d["text"];
                })
                .attr("x", function(d) {
                    return d["draw_area"]["start_x"];
                })
                .attr("y", function(d) {
                    return d["draw_area"]["start_y"];
                });
                // drawTextCenterArrows(e);
                return e;
            },
            function(update) {
                return update;
            },
            function(exit) {
                return exit.remove();
            },
        )
    }

    /**
     * Calculates the BBox of a SVG text element without displaying it on a screen
     * @namespace
     * @exports NaView
     * @name getBBoxGhostText 
     * @param {Object} data data object for the text object including font and text to be drawn
     * @param {String} path_id_keep optional id for keeping element after generation
     * @yields {Object} getBBox results of text
     */
    function getBBoxGhostText(data, path_id_keep) {
        let pg = d3.select("#"+svg_id)
        .append("g")
        .attr("id", function() {
            if (path_id_keep) {
                return "par"+path_id_keep;
            }
            return;
        })
        .attr("visibility", "hidden");

        let p = pg.append("text")
        .attr("id", function() {
            if (path_id_keep) {
                return path_id_keep;
            }
            return;
        })
        .attr("fill", function() {
            return data["fill"];
        } )
        .attr("font-style", function() {
            return data["font_style"];
        })
        .attr("font-family", function() {
            return data["font_family"];
        })
        .attr("font-size", function() {
            return data["font_size"];
        })
        .text(function() {
            return data.text;
        })
        ;

        let val = p.node().getBBox();
        // val = roundDecimals(val, 2);
        if (!path_id_keep) {
            pg.remove();
        }
        return val;
    }

    /**
     * Verifies if current selection has a number corresponding to a residue Id
     * @namespace
     * @exports NaView
     * @name convertToResInd 
     * @param {String} resobj selection string to be checked
     * @yields {Array} if selection has index returns index of current selection, true<br>
     * else returns current selection, false
     */
    function convertToResInd(resobj) {
        let resobj_str = resobj + "";
        if (/\d+/.test(resobj) && resobj_str.includes(";") === false) {
            let objind = resobj_str.match(/\d+/)[0];
            return [parseInt(objind), true];
        }
        return [resobj, false];
    }
    
}

