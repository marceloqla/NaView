$(document).ready(function(){
	$('#select-protein').select2();
	//TODO: Change rows to 100000
	$.ajax({
        url: 'https://www.uniprot.org/uniprot/?query=family:%22sodium%20channel%20(TC%201.A.1.10)%20family%22&format=tab&limit=10&columns=id,entry%20name&sort=score',
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
					<button id="submit" type="button" class="btn btn-primary">Submit</button>
				</div>`
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