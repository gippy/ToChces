@extends('../app')

@section('message')
    <div class="message empty"></div>
@endsection

@section('content')
    <div class="narrow pad-t-l profile">
        <div class="user mrg-b-s" style="margin-left: 9px;">
            <img src="{! $user->image ? $user->image : '/images/avatar.png' !}" alt="{! $user->name !}" class="profile-photo pull-left"/>
            <h1 class="h3 mrg-t-n">{! $user->name !}</h1>
        </div>
        <div class="products mrg-b-m mrg-t-m">
            @include('partials.products')
        </div>
    </div>
@endsection