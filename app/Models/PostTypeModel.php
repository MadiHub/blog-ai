<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class PostTypeModel extends Model
{
    use HasFactory;
    protected $table = 'tb_post_type';
    protected $primaryKey = 'id';

    protected $fillable = [
        'position',
        'name',
        'slug',
        'description',
        'icon',
    ];

    // SET TIMESTAMP
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function posts()
    {
        return $this->hasMany(PostModel::class, 'post_type_id', 'id');
    }

}