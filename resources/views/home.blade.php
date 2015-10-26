@extends('app')

@section('message')
    <div class="message">
        Nechte se inspirovat a sestavte si svuj seznam vecí a služeb, které musíte mít nebo chcete darovat.
    </div>
@endsection

@section('content')
    <div class="home narrow pad-t-l">
        @include('partials.products')
    </div>
@endsection
