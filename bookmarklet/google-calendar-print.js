includeCss( 'http://nick.ci-fi.net/css/smoothness/jquery-ui-1.7.2.custom.css' );
include( 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js' );
include( 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js', function () {
    jQuery.noConflict();
    
    ( function ($) {
    $.ui.dialog.defaults.bgiframe = true;
    $.datepicker.setDefaults({
        dateFormat: 'yymmdd'
    });
    
    var baseUrl = 'http://www.google.com/calendar/printable';
    
    var calendars = {};
    $( '.calListChip' ).each( function () {
        var m = this.id.match( /label-(.+)$/ );
        if ( !m || m.length != 2 ) { return true; }
        
        var bg = $( this ).children().eq( 0 ).css( 'backgroundColor' );
        var css = {
            backgroundColor: bg
        };
        
        calendars[ m[1] ] = { title: this.title, css: css };
    });

    $.fn.appendAsOptions = function ( arr, useIndex ) {
        useIndex = useIndex === undefined ? true : useIndex;
        this.each( function () {
            var e = $( this );
            $.each( arr, function ( k, v ) {
                e.append( $( '<option>' ).val( useIndex ? k : v ).html( v ) );
            });
        });
        
        return this;
    };

    $.fn.makeLabel = function ( text, position, css ) {
        position = position || 'before';
        this.each( function () {
            var e = $( this );
            var label = $( '<label>' )
                .attr( 'for', e.attr( 'id' ) )
                .html( text )
                .css( css );
            e[ position ]( label );
        });

        return this;
    };
    
    var div = $( '<div id="printdialog">' ).css({
        backgroundColor: 'white'
    })
        .appendTo( 'body' )
        .dialog({
            title: 'Print Calendar',
            autoOpen: false
        });
    
    var form = $( '<form>' ).attr( 'action', baseUrl ).appendTo( div );
    var parent = form;
    
    var startdate = $( '<input id="startdate">' )
        .appendTo( parent ).datepicker();
    var enddate = $( '<input id="enddate">' )
        .appendTo( parent ).datepicker();

    var calendar_cb = $.each( calendars, function ( k, v ) {
        $( '<input type="checkbox" checked="checked" name="src">' )
            .attr( 'id', k + '_cb' )
            .val( k )
            .appendTo( parent )
            .wrap( '<div>' )
            .makeLabel( v.title, 'after', v.css );
    });

    var pageSize = $( '<select name="pgsz">' ).appendAsOptions({
        letter: 'Letter',
        legal: 'Legal'
    }).appendTo( parent ).wrap( '<div>' ).makeLabel( 'Page Size' );

    var mode = $( '<select name="mode">' ).appendAsOptions({
        MONTH: 'Month',
        WEEK: 'Week',
        AGENDA: 'Agenda'
    }).appendTo( parent ).wrap( '<div>' ).makeLabel( 'Display Mode' );

    var weekStart = $( '<select name="wkst">' ).appendAsOptions({
        1: 'Sunday', 2: 'Monday', 3: 'Tuesday', 4: 'Wednesday', 5: 'Thursday',
        6: 'Friday', 7: 'Saturday'
    }).appendTo( parent ).wrap( '<div>' ).makeLabel( 'Week Start' );

    var declined =
        $( '<input id="psdec" type="checkbox" name="psdec" checked="checked" value="true">' )
            .appendTo( parent )
            .wrap( '<div>' )
            .makeLabel( 'Show declined?', 'after' );
            
    var format = $( '<select id="pft" name="pft">' ).appendAsOptions([
        'pdf',
        'png'
    ], false )
        .appendTo( parent )
        .wrap( '<div>' )
        .makeLabel( 'Format' );
        
    var cancel = $( '<button>' )
        .click( function ( e ) {
            e.preventDefault();
            div.dialog( 'close' );
            return false;
        })
        .appendTo( parent )
        .html( 'Cancel' );
        
    var link = $( '<a>' )
        .attr( 'target', '_blank' )
        .html( 'Link to PDF' ).appendTo(
            $( '<div>' ).hide().appendTo( parent )
        );
        
    var generate = $( '<button>' ).click( function ( e ) {
        e.preventDefault();
        var url = form.attr( 'action' ) + '?' + form.serialize();
        url += '&' + $.param({ 'dates': startdate.val() + '/' + enddate.val() });
        
        link.attr( 'href', url ).parent().show();
        return false;
    }).html( 'Generate URL' ).insertBefore( link.parent() );

    $( '#printlinkImg, #printlinkSpan' ).attr( 'onclick', '' ).click( function () {
        div.dialog( 'open' );
    });
    
    })( jQuery );
});

function include( url, callback ) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = url;
    if ( callback ) {
        s.onreadystatechange = callback;
        s.onload = callback;
    }
    document.getElementsByTagName( 'head' )[0].appendChild( s );
}

function includeCss( url ) {
    var s = document.createElement('link');
    s.href = url;
    s.type = 'text/css';
    s.rel = 'stylesheet';
    document.getElementsByTagName( 'head' )[0].appendChild( s );
}

