@extends('../app')

@section('message')
    <div class="message empty"></div>
@endsection

@section('content')
    <div class="narrow pad-t-l profile">
        <div class="user mrg-b-s" style="margin-left: 9px;">
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

        <div class="settings mrg-b-m">
            <form method="POST" enctype="multipart/form-data">
                <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                <div class="clearfix mrg-t-l inline-field large-label">
                    <label>Změnit profilové foto</label>
                    <label class="file-button">
                        <input type="file" name="photo" onchange="this.form.submit()"/>
                        Zvolte nové foto
                    </label>

                </div>
            </form>
        </div>

    </div>
@endsection