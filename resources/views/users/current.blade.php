@extends('../app')

@section('content')
    <div class="narrow pad-t-l profile">
        <div class="user mrg-b-m">
            <img src="{! $user->image ? $user->image : '/images/avatar.png' !}" alt="{! $user->name !}" class="profile-photo pull-left"/>
            <h1 class="h3 mrg-t-n">{! $user->name !}</h1>
            <p class="h3">
                <a href="{! URL::route('addProduct') !}">Přidat věc</a>
                <span class="accent">&nbsp;|&nbsp;</span>
                <a href="{! URL::route('settings') !}">Nastavení</a>
                <span class="accent">&nbsp;|&nbsp;</span>
                <a href="{! URL::route('logout') !}">Odhlásit se</a>
            </p>
        </div>
        <div class="products mrg-b-m">
            @include('partials.products')
        </div>

    </div>
@endsection