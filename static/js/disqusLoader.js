/*
 disqusLoader.js v1.0
 A JavaScript plugin for lazy-loading Disqus comments widget.
 -
 By Osvaldas Valutis, www.osvaldas.info
 Available for use under the MIT License
 */

;( function( window, document )
{
    'use strict';

    var extendObj = function( defaults, options )
        {
            var prop, extended = {};
            for( prop in defaults )
                if( Object.prototype.hasOwnProperty.call( defaults, prop ))
                    extended[ prop ] = defaults[ prop ];

            for( prop in options )
                if( Object.prototype.hasOwnProperty.call( options, prop ))
                    extended[ prop ] = options[ prop ];

            return extended;
        },
        getOffset = function( el )
        {
            var rect = el.getBoundingClientRect();
            return { top: rect.top + document.body.scrollTop, left: rect.left + document.body.scrollLeft };
        },
        loadScript = function( url )
        {
            var script	 = document.createElement( 'script' );
            script.src	 = url;
            script.async = true;
            script.setAttribute( 'data-timestamp', +new Date());
            ( document.head || document.body ).appendChild( script );
        },
        throttle		= function(a,b){var c,d;return function(){var e=this,f=arguments,g=+new Date;c&&g<c+a?(clearTimeout(d),d=setTimeout(function(){c=g,b.apply(e,f)},a)):(c=g,b.apply(e,f))}},

        throttleTo		= false,
        laziness		= false,
        disqusConfig	= false,
        scriptUrl		= false,

        scriptStatus	= 'unloaded',
        instance		= false,

        init = function()
        {
            if( !instance || !document.body.contains( instance ) )
                return;

            var winST	= window.pageYOffset,
                offset	= getOffset( instance ).top;

            // if the element is too far below || too far above
            if( offset - winST > window.innerHeight * laziness || winST - offset - instance.offsetHeight - ( window.innerHeight * laziness ) > 0 )
                return;

            window.removeEventListener( 'scroll', throttle( throttleTo, init ));
            window.removeEventListener( 'resize', throttle( throttleTo, init ));

            var tmp = document.getElementById( 'disqus_thread' );
            if( tmp ) tmp.removeAttribute( 'id' );
            instance.setAttribute( 'id', 'disqus_thread' );

            window.disqus_config = disqusConfig;
            loadScript( scriptUrl );
        };

    window.addEventListener( 'scroll', throttle( throttleTo, init ));
    window.addEventListener( 'resize', throttle( throttleTo, init ));

    window.disqusLoader = function( element, options )
    {
        options = extendObj(
            {
                laziness:		1,
                throttle:		500,
                scriptUrl:		false,
                disqusConfig:	false

            }, options );

        laziness		= options.laziness + 1;
        throttleTo		= options.throttle;
        disqusConfig	= options.disqusConfig;
        scriptUrl		= options.scriptUrl;

        instance = document.querySelector(element);

        init();
    };

}( window, document ));
