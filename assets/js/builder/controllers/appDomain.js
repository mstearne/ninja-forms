define( [
	'builder/models/appDomainCollection',
	'builder/views/mainContentFields',
	'builder/views/mainContentActions',
	'builder/views/mainContentSettings',
	'builder/views/mainHeaderFields',
	'builder/views/mainHeaderActions',
	'builder/views/mainHeaderSettings',
	'builder/views/subHeaderFields',
	'builder/views/subHeaderActions',
	'builder/views/subHeaderSettings',

	], 
	function( 
		appDomainCollection,
		mainContentFieldsView,
		mainContentActionsView,
		mainContentSettingsView,
		mainHeaderFieldsView,
		mainHeaderActionsView,
		mainHeaderSettingsView,
		subHeaderFieldsView,
		subHeaderActionsView,
		subHeaderSettingsView
	) {
	var controller = Marionette.Object.extend( {
		initialize: function() {

			this.collection = new appDomainCollection( [
				{
					id: 'fields',
					nicename: 'Form Fields',

					getMainHeaderView: function() {
						return new mainHeaderFieldsView();
					},

					getSubHeaderView: function() {
						return new subHeaderFieldsView();
					},

					getMainContentView: function() {
						return new mainContentFieldsView();
					}
				},
				{
					id: 'actions',
					nicename: 'Emails & Actions',

					getMainHeaderView: function() {
						return new mainHeaderActionsView();
					},

					getSubHeaderView: function() {
						return new subHeaderActionsView();
					},
					
					getMainContentView: function() {
						return new mainContentActionsView();
					}
				},
				{
					id: 'settings',
					nicename: 'Settings',

					getMainHeaderView: function() {
						return new mainHeaderSettingsView();
					},

					getSubHeaderView: function() {
						return new subHeaderSettingsView();
					},
					
					getMainContentView: function() {
						return new mainContentSettingsView();
					}
				},
				{
					id: 'preview',
					nicename: 'Preview Changes',
					classes: 'preview',
					dashicons: 'dashicons-visibility',
					url: 'http://www.cnn.com'
				}
			] );

			nfRadio.channel( 'app' ).reply( 'get:appDomainCollection', this.getAppDomainCollection, this );
			
			nfRadio.channel( 'app' ).reply( 'change:domain', this.changeAppDomain, this );
			this.listenTo( nfRadio.channel( 'app' ), 'click:appMenu', this.changeAppDomain );
			this.listenTo( nfRadio.channel( 'app' ), 'click:changeDomain', this.maybeChangeDomain );
		},

		getAppDomainCollection: function() {
			return this.collection;
		},

		changeAppDomain: function( model ) {
			
			if ( nfRadio.channel( 'drawer' ).request( 'is:moving' ) ) {
				return false;
			}
			if ( nfRadio.channel( 'app' ).request( 'get:currentDrawer' ) ) {
				nfRadio.channel( 'app' ).request( 'close:drawer' );
			}
			
			if ( 0 == model.get( 'url' ).length ) {
				var updated = nfRadio.channel( 'app' ).request( 'update:appDomain', model );
				nfRadio.channel( 'app' ).trigger( 'change:appDomain', model );
			}
		},

		maybeChangeDomain: function( e ) {
			var domainID = jQuery( e.target ).data( 'domain' );
			var domainModel = this.collection.get( domainID );
			this.changeAppDomain( domainModel );
		}

	});

	return controller;
} );