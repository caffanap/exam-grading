<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NilaiTryout extends Model
{
    protected $fillable = ['user_id', 'tryout_id', 'benar', 'salah', 'kosong', 'nilai', 'sisa_waktu', 'jawaban_user'];
    //
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
