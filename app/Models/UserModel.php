<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable; 
use Illuminate\Auth\Authenticatable as AuthenticatableTrait; 
use DateTimeInterface;

class UserModel extends Model implements Authenticatable 
{
    use HasFactory, AuthenticatableTrait;

    protected $table = 'tb_users';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'username',
        'email',
        'role',
        'avatar',
        'password',
        'google_id',
    ];

    // Sembunyikan atribut password saat di-serialize menjadi array/JSON
    protected $hidden = [
        'password',
    ];

    // SET TIMESTAMP
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function comments()
    {
        return $this->hasMany(CommentModel::class, 'user_id', 'id');
    }
}