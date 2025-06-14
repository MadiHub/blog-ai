<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class CommentModel extends Model
{
    use HasFactory;
    protected $table = 'tb_comments';
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'post_id',
        'comment',
        'parent_id',
    ];

    // Relasi: Setiap komentar dimiliki oleh satu pengguna (userComment)
    public function userComment()
    {
        return $this->belongsTo(UserModel::class, 'user_id', 'id');
    }

    // Relasi: Setiap komentar terhubung ke satu postingan
    public function post()
    {
        return $this->belongsTo(PostModel::class, 'post_id', 'id');
    }

    // Relasi: Untuk balasan komentar (self-referencing relationship)
    // Komentar yang menjadi parent
    public function parentComment()
    {
        return $this->belongsTo(CommentModel::class, 'parent_id');
    }

    // Relasi: Untuk balasan komentar (self-referencing relationship)
    // Balasan-balasan untuk komentar ini
    public function replies()
    {
        return $this->hasMany(CommentModel::class, 'parent_id');
    }


    // SET TIMESTAMP
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}