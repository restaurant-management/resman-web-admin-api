$(function(){

    /*************************************************/
    /**************** BASIC DATATABLE ****************/
    /*************************************************/

    /* Define two custom functions (asc and desc) for string sorting */
    jQuery.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
        return ((x < y) ? -1 : ((x > y) ?  1 : 0));
    };

    jQuery.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
        return ((x < y) ?  1 : ((x > y) ? -1 : 0));
    };

    /* Build the DataTable with third column using our custom sort functions */
    var oTable01 = $('#basicDataTable').dataTable({
        "aoColumnDefs": [
            { 'bSortable': false, 'aTargets': [ "no-sort" ] }
        ],
        "aaSorting": [ [0,'asc'], [1,'asc'] ],
        // Error when basic table have more than 5 columns
        // "aoColumns": [
        //     null,
        //     null,
        //     { "sType": 'string-case' },
        //     null,
        //     null
        // ],
    });

    /*******************************************************/
    /**************** INLINE EDIT DATATABLE ****************/
    /*******************************************************/

    function restoreRow (oTable02, nRow){
        var aData = oTable02.fnGetData(nRow);
        var jqTds = $('>td', nRow);

        for ( var i=0, iLen=jqTds.length ; i<iLen ; i++ ) {
            oTable02.fnUpdate( aData[i], nRow, i, false );
        }

        oTable02.fnDraw();
    };

    function editRow (oTable02, nRow){
        var aData = oTable02.fnGetData(nRow);
        var jqTds = $('>td', nRow);
        jqTds[0].innerHTML = '<input type="text" value="'+aData[0]+'" class="form-control">';
        jqTds[1].innerHTML = '<input type="text" value="'+aData[1]+'" class="form-control">';
        jqTds[2].innerHTML = '<input type="text" value="'+aData[2]+'" class="form-control">';
        jqTds[3].innerHTML = '<input type="text" value="'+aData[3]+'" class="form-control">';
        jqTds[4].innerHTML = '<input type="text" value="'+aData[4]+'" class="form-control">';
        jqTds[5].innerHTML = '<a class="edit save" href="#">Save</a><a class="delete" href="#">Delete</a>';
    };

    function saveRow (oTable02, nRow){
        var jqInputs = $('input', nRow);
        oTable02.fnUpdate( jqInputs[0].value, nRow, 0, false );
        oTable02.fnUpdate( jqInputs[1].value, nRow, 1, false );
        oTable02.fnUpdate( jqInputs[2].value, nRow, 2, false );
        oTable02.fnUpdate( jqInputs[3].value, nRow, 3, false );
        oTable02.fnUpdate( jqInputs[4].value, nRow, 4, false );
        oTable02.fnUpdate( '<a class="edit" href="#">Edit</a><a class="delete" href="#">Delete</a>', nRow, 5, false );
        oTable02.fnDraw();
    };



    var oTable02 = $('#inlineEditDataTable').dataTable({
        "oLanguage": {
            "sSearch": ""
        },
        "aoColumnDefs": [
            { 'bSortable': false, 'aTargets': [ "no-sort" ] }
        ],
    });

    // Append add row button to table
    var addRowLink = '<a href="#" id="addRow" class="btn btn-green btn-xs add-row">Add row</a>'
    $('#inlineEditDataTable_wrapper').append(addRowLink);

    var nEditing = null;

    // Add row initialize
    $('#addRow').click( function (e) {
        e.preventDefault();

        // Only allow a new row when not currently editing
        if ( nEditing !== null ) {
            return;
        }

        var aiNew = oTable02.fnAddData([ '', '', '', '', '', '<a class="edit" href="">Edit</a>', '<a class="delete" href="">Delete</a>' ]);
        var nRow = oTable02.fnGetNodes(aiNew[0]);
        editRow(oTable02, nRow);
        nEditing = nRow;

        $(nRow).find('td:last-child').addClass('actions text-center');
    });

    // Delete row initialize
    $(document).on( "click", "#inlineEditDataTable a.delete", function(e) {
        e.preventDefault();

        var nRow = $(this).parents('tr')[0];
        oTable02.fnDeleteRow( nRow );
    });

    // Edit row initialize
    $(document).on( "click", "#inlineEditDataTable a.edit", function(e) {
        e.preventDefault();

        /* Get the row as a parent of the link that was clicked on */
        var nRow = $(this).parents('tr')[0];

        if (nEditing !== null && nEditing != nRow){
            /* A different row is being edited - the edit should be cancelled and this row edited */
            restoreRow(oTable02, nEditing);
            editRow(oTable02, nRow);
            nEditing = nRow;
        }
        else if (nEditing == nRow && this.innerHTML == "Save") {
            /* This row is being edited and should be saved */
            saveRow(oTable02, nEditing);
            nEditing = null;
        }
        else {
            /* No row currently being edited */
            editRow(oTable02, nRow);
            nEditing = nRow;
        }
    });

    /******************************************************/
    /**************** DRILL DOWN DATATABLE ****************/
    /******************************************************/

    var anOpen = [];

    var oTable03 = $('#drillDownDataTable').dataTable({
        "oLanguage": {
            "sSearch": ""
        },
        "aoColumnDefs": [
            { 'bSortable': false, 'aTargets': [ "no-sort" ] }
        ],
        "aaSorting": [[ 1, "asc" ]],
        "bProcessing": true,
        "sAjaxSource": "assets/js/vendor/datatables/ajax/sources/objects.txt",
        "aoColumns": [
            {
                "mDataProp": null,
                "sClass": "control text-center",
                "sDefaultContent": '<a href="#"><i class="fa fa-plus"></i></a>'
            },
            { "mDataProp": "engine" },
            { "mDataProp": "browser" },
            { "mDataProp": "grade" }
        ]
    });

    $(document).on( 'click', '#drillDownDataTable td.control', function () {
        var nTr = this.parentNode;
        var i = $.inArray( nTr, anOpen );

        $(anOpen).each( function () {
            if ( this !== nTr ) {
                $('td.control', this).click();
            }
        });

        if ( i === -1 ) {
            $('i', this).removeClass().addClass('fa fa-minus');
            $(this).parent().addClass('drilled');
            var nDetailsRow = oTable03.fnOpen( nTr, fnFormatDetails(oTable03, nTr), 'details' );
            $('div.innerDetails', nDetailsRow).slideDown();
            anOpen.push( nTr );
        }
        else {
            $('i', this).removeClass().addClass('fa fa-plus');
            $(this).parent().removeClass('drilled');
            $('div.innerDetails', $(nTr).next()[0]).slideUp( function () {
                oTable03.fnClose( nTr );
                anOpen.splice( i, 1 );
            } );
        }

        return false;
    });

    function fnFormatDetails( oTable03, nTr ){
        var oData = oTable03.fnGetData( nTr );
        var sOut =
            '<div class="innerDetails">'+
            '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr><td>Rendering engine:</td><td>'+oData.engine+'</td></tr>'+
            '<tr><td>Browser:</td><td>'+oData.browser+'</td></tr>'+
            '<tr><td>Platform:</td><td>'+oData.platform+'</td></tr>'+
            '<tr><td>Version:</td><td>'+oData.version+'</td></tr>'+
            '<tr><td>Grade:</td><td>'+oData.grade+'</td></tr>'+
            '</table>'+
            '</div>';
        return sOut;
    };

    /****************************************************/
    /**************** ADVANCED DATATABLE ****************/
    /****************************************************/

    var oTable04 = $('#advancedDataTable').dataTable({
        "oLanguage": {
            "sSearch": ""
        },
        "oTableTools": {
            "sSwfPath": "assets/js/vendor/datatables/tabletools/swf/copy_csv_xls_pdf.swf",
            "aButtons": [
                "copy",
                "print",
                {
                    "sExtends":    "collection",
                    "sButtonText": 'Save <span class="caret" />',
                    "aButtons":    [ "csv", "xls", "pdf" ]
                }
            ]
        },
        "oColVis": {
            "buttonText": '<i class="fa fa-eye"></i>'
        }
    });

    $('.ColVis_MasterButton').on('click', function(){
        var newtop = $('.ColVis_collection').position().top - 45;

        $('.ColVis_collection').addClass('dropdown-menu');
        $('.ColVis_collection>li>label').addClass('btn btn-default')
        $('.ColVis_collection').css('top', newtop + 'px');
    });

    $('.DTTT_button_collection').on('click', function(){
        var newtop = $('.DTTT_dropdown').position().top - 45;
        $('.DTTT_dropdown').css('top', newtop + 'px');
    });

})