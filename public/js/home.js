var naview;

$(document).ready(function(){
	$('#select-protein').select2();
	//TODO: Change rows to 100000
	$.ajax({
        url: 'https://www.uniprot.org/uniprot/?query=family:%22sodium%20channel%20(TC%201.A.1.10)%20family%22&format=tab&columns=id,entry%20name&sort=score',
        headers: {
            'Content-Type': 'text/plain'
        },
        type: "GET",
        crossDomain: true,
        success: function (result) {
        	$("#content-home").empty()
        	let lines = result.split("\n");
        	let options = ""
        	for(let i = 1; i < lines.length-1; i++){
        		let tuple = lines[i].split("\t")
        		options += `<option value="${tuple[0]}">${tuple[1]} (${tuple[0]})</option>\n`;
        	}
            $("#content-home").append(
            	`<div id="select-container">
					<span>Select the sequence:</span>
					<select id="select-protein" class="js-example-basic-single" name="state">
						${options}
					</select>
					<button id="submit" type="button" class="btn btn-primary" onclick="generateView()">Submit</button>
				</div><div id="result"></div>`
        	);
            $('#select-protein').select2();
        },
        error: function () {
        	$("#content-home").empty()
        	$("#content-home").append(
        		`<div class="alert alert-danger" role="alert">
        			<strong>Oh snap!</strong> There was a problem when connecting to UniProt.
        		</div>`
    		)
            console.log("ERROR");
        }
    });
});

function resetController(){
    var style_obj = naview.getStyleObject("json");
    var style_editor = new NaViewStyleEditor(naview, "style_editor", "style_editor_console");
}

function generateView(){
    let uniprot_id = $('#select-protein').find(':selected')[0].value;
    let div_width = document.getElementById("result").offsetWidth;
    console.log(div_width);
    $("#result").empty();
    $("#result").append(`<div class="spinner-border" role="status">
                            <div class="loader" id="loader-1"></div>
                        </div>`);
    
    $.ajax({
        url: `https://www.uniprot.org/uniprot/${uniprot_id}.txt`,
        headers: {
            'Content-Type': 'text/plain'
        },
        type: "GET",
        crossDomain: true,
        success: function (result) {
            $("#result").empty();
            $("#result").append(`<button id="reset" type="button" class="btn btn-primary" onclick="resetController()">Reset controller</button>`)
            naview = new NaView({"protein_input":result, "container_id": "result", "svg_width": div_width});
            var style_obj = naview.getStyleObject("json");
            var style_editor = new NaViewStyleEditor(naview, "style_editor", "style_editor_console");
            
        },
        error: function () {
            $("#result").empty();
            $("#result").append(
                `<div class="alert alert-danger" role="alert">
                    <strong>Oh snap!</strong> There was a problem when connecting to UniProt.
                </div>`
            )
            console.log("ERROR");
        }
    });
}