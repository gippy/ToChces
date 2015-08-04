<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>To Chcete</title>

	<link href="{! asset('/css/app.css') !}" rel="stylesheet">

    <script src="//use.typekit.net/ags8tfo.js"></script>
    <script>try{Typekit.load();}catch(e){console.log(e)}</script>

    <!--<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.16/angular.min.js"></script>-->
    <script src="{! asset('/js/jquery.js') !}"></script>
    <script src="{! asset('/js/angular.js') !}"></script>
    <script src="{! asset('/js/ng-tags-input.min.js') !}"></script>
    <script src="{! asset('/js/all.js') !}"></script>

	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->
</head>
<body class="proxima" ng-app="ToChcete" ng-controller="BodyController" ng-class="isModalVisible() ? 'has-modal' : ''">

    <nav ng-controller="NavigationController" ng-class="'navigation' + ' ' + scrollClass">
        <div scroll-over limit=50 on-change="scrollChanged()" >
            <ul class="center-text">
                <li><a ng-click="showCategories()">Kategorie</a></li>
                <li class="logo"><a href="/"><img src="{! URL::asset('images/logo.png') !}" width="115" height="100" alt="To Chcete"/></a></li>
                @if (Auth::guest())
                    <li><a ng-click="showSignIn()">Přihlášení</a></li>
                @else
                    <li><a href="{! URL::route('profile') !}">Profil</a></li>
                @endif
                <li class="search">
                    <form method="GET" action="/home">
                        <input type="text" name="search" onchange="this.form.submit()" value="{! Input::get('search', '') !}" />
                        <img src="{! URL::asset('/images/search-small.png') !}" alt="hledat" title="hledat"/>
                    </form>
                </li>
            </ul>
        </div>
    </nav>

    <div class="page" ng-controller="PageController">
        <div class="content">
            @yield('content')
        </div>
    </div>

    <div class="modal" ng-controller="ModalController" ng-class="type + (isVisible() ? '' : ' fade')">
        <div class="wrapper">
            <span class="close" ng-click="close()">&nbsp;</span>
            <div class="content" ng-include ng-if="url" src="url">
            </div>
        </div>
    </div>
</body>
</html>
