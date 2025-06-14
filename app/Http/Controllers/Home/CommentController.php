<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

use App\Models\CommentModel;

class CommentController extends Controller
{
    public function comment_store(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'post_id' => 'required|exists:tb_post,id',
            'comment' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:tb_comments,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized. Anda harus login untuk berkomentar.'], 401);
        }

        $originalCommentContent = $request->input('comment');
        $filteredCommentContent = $this->filterProfanity($originalCommentContent);

        $comment = CommentModel::create([
            'user_id' => Auth::id(),
            'post_id' => $request->post_id,
            'parent_id' => $request->parent_id,
            'comment' => $filteredCommentContent,
        ]);

        $comment->load('userComment', 'replies.userComment');

        return response()->json($comment, 201);
    }

    public function comment_destroy(CommentModel $comment)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        if (Auth::id() !== $comment->user_id) {
            return response()->json(['message' => 'Forbidden. Anda tidak memiliki izin untuk menghapus komentar ini.'], 403);
        }

        CommentModel::where('parent_id', $comment->id)->update(['parent_id' => null]);

        $comment->delete();

        return response()->json(['message' => 'Komentar berhasil dihapus.'], 200);
    }

    // sesor semua
    // protected function filterProfanity(string $text): string
    // {
    //     $badWords = [
    //         'bangsat',
    //         'kontol',
    //         'memek',
    //         'asu',
    //         'ngentot',
    //         'babi',
    //         'anjing',
    //     ];

    //     $pattern = '/\b(' . implode('|', $badWords) . ')\b/i';

    //     $filteredText = preg_replace_callback($pattern, function ($matches) {
    //         return str_repeat('*', Str::length($matches[0]));
    //     }, $text);

    //     return $filteredText;
    // }
    protected function filterProfanity(string $text): string
    {
        $badWords = [
            'bangsat', 'kontol', 'memek', 'asu', 'ngentot', 'babi', 'anjing', 'ajg',
            'goblok', 'tolol', 'kampret', 'jancok', 'brengsek', 'perek', 'idiot',
            'bodoh', 'keparat', 'setan', 'tai', 'pepek', 'kimak', 'sundal', 'sarap',
            'pecun', 'lonte', 'bencong', 'banci', 'pelacur', 'cabul', 'jembut', 'titit',
            'tetek', 'pantat', 'ngewe', 'ml', 'henceut', 'colmek', 'coli', 'kntl',
            'pntk', 'jilat', 'jable', 'wikwik', 'bokep', 'jav', 'ngulum', 'anal',
            
            'k0nt0l', 'mem3k', 'ng3ntot', 'b@bi', '4njing', 'b4ngsat', 'p3pek', 'k0ntol',
            'g0blok', 't0lol', 'j4ncok', 'b4bi', 'n4j1s', '1diot',

            'fuck', 'shit', 'bitch', 'bastard', 'dick', 'pussy', 'asshole', 'jerk',
            'motherfucker', 'whore', 'slut', 'faggot', 'retard', 'cunt',

            'anjrit', 'anjay', 'dancok', 'tai', 'tolollu', 'ngatain', 'kocaklu',

            'bj', 'sex', 'seks', '3gp', 'xnxx', 'xvideos', 'titid', 'ngewe', 'ewean',
        ];


        $pattern = '/\b(' . implode('|', $badWords) . ')\b/i';

        $filteredText = preg_replace_callback($pattern, function ($matches) {
            $word = $matches[0]; 
            $length = Str::length($word);

            if ($length <= 2) {
                return str_repeat('*', $length);
            }

            $firstChar = Str::substr($word, 0, 1);
            $lastChar = Str::substr($word, -1, 1);

            $starsCount = $length - 2;

            return $firstChar . str_repeat('*', $starsCount) . $lastChar;
        }, $text);

        return $filteredText;
    }
}