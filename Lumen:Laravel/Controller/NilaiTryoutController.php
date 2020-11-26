<?php

namespace App\Http\Controllers;

use App\AssignSoal;
use App\NilaiTryout;
use Illuminate\Http\Request;
use stdClass;

class NilaiTryoutController extends Controller
{
    public function show(Request $request, NilaiTryout $nilai_tryout)
    {
        $data = $nilai_tryout->with('user')->where('tryout_id', $request->tryout_id)->orderBy('nilai', 'DESC')->orderBy('sisa_waktu', 'DESC')->get();
        $result = [];
        foreach ($data as $value) {
            $new = new stdClass();
            $new->id = $value->id;
            $new->img = $value->user->img;
            $new->nama = $value->user->nama;
            $new->nilai = $value->nilai;
            $new->sisa_waktu = $value->sisa_waktu;
            $result[] = $new;
        }
        return $result;
    }

    public function assignTryout(Request $request, AssignSoal $assign_soal, NilaiTryout $NilaiTryout)
    {
        $soal = $assign_soal->with(['bank_soal'])->where(['tryout_id' => $request->tryout_id])->get();
        $kunci_server = [];
        foreach ($soal as $val) {
            $soalNew = new stdClass();
            $soalNew->id = $val->bank_soal->id;
            $soalNew->kunci = $val->bank_soal->kunci;
            $kunci_server[] = $soalNew;
        }
        $kunci_server = collect($kunci_server);

        $answer = explode(',', $request->answer);
        unset($answer[count($answer) - 1]); // menghapus index terakhir yang pasti kosong
        $result = [];
        foreach ($answer as $value) {
            $explode_jawaban = explode('-', $value);
            $newPil = new stdClass();
            $newPil->id = $explode_jawaban[0];
            $newPil->jawaban = $explode_jawaban[1];
            $result[] = $newPil;
        }

        $benar = 0;
        $kosong = 0;
        $salah = 0;

        foreach ($result as $value) {
            $filtered = $kunci_server->first(function ($val) use ($value) {
                return $val->id == $value->id;
            });
            if ($filtered->kunci == $value->jawaban) {
                $benar++;
            } else {
                $salah++;
            }
        }

        $kosong = count($kunci_server) - $benar - $salah;
        $nilai = ($benar / count($kunci_server)) * 100;

        $data = [
            'benar' => $benar,
            'salah' => $salah,
            'kosong' => $kosong,
            'nilai' => $nilai,
            'tryout_id' => $request->tryout_id,
            'user_id' => $request->user_id,
            'sisa_waktu' => $request->sisa_waktu,
            'jawaban_user' => $request->answer
        ];

        $penilaian = $NilaiTryout->create($data);

        if ($penilaian) {
            return response()->json([
                'status' => 201,
                'message' => 'Hasil Ujian Anda Telah Dinilai!',
                'benar' => $benar,
                'salah' => $salah,
                'kosong' => $kosong,
                'nilai' => $nilai
            ], 201);
        }else{
            return response()->json([
                'status' => 400,
                'message' => 'Gagal Menilai Hasil Tryout, Silakan klik refresh!'
            ], 400);
        }
    }

}
