$(function(){

    //check all checkboxes
    $('table thead input[type="checkbox"]').change(function () {
        $(this).parents('table').find('tbody input[type="checkbox"]').prop('checked', $(this).prop('checked'));
    });

    // sortable table
    $('.table.table-sortable th.sortable').click(function() {
        var o = $(this).hasClass('sort-asc') ? 'sort-desc' : 'sort-asc';
        $(this).parents('table').find('th.sortable').removeClass('sort-asc').removeClass('sort-desc');
        $(this).addClass(o);
    });

    //chosen select input
    $(".chosen-select").chosen({disable_search_threshold: 10});

    //check toggling
    $('.check-toggler').on('click', function(){
        $(this).toggleClass('checked');
    })

})