'use client';
import { Button } from '@//components/ui/button';
import { Input } from '@//components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { progressType, recipeResult } from '@/lib/types';
import { CircleCheck, CircleX } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<recipeResult[]>([]);
  const [error, setError] = useState<progressType>();

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/get-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (data.name) {
      setRecipes([...recipes, data]);
    }
    setLoading(false);
    console.log(data);
    if (data.error && data.progress) {
      setError(data.progress as progressType);
    } else if (data.error) {
      alert('Internal server error');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold'>Welcome to social to Mealie</h1>
      <Input type='url' className='w-96 m-4' value={url} onChange={(e) => setUrl(e.target.value)} />
      <Button className='w-96' onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </Button>
      <div className='flex flex-wrap justify-center gap-4 max-w-7xl'>
        {recipes.map((recipe) => (
          <a href={recipe.url} key={recipe.url} target='_blank' rel='noreferrer'>
            <Card className='mt-4 w-60'>
              <CardHeader>
                <img src={recipe.imageUrl} alt={recipe.description} className='aspect-square object-cover' />
                <CardTitle>{recipe.name}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>
      {error && (
        <Card className={'mt-4 w-96'}>
          <CardHeader>
            <CardTitle>Error during import</CardTitle>
          </CardHeader>
          <CardContent className={'flex flex-col gap-4 justify-center items-center'}>
            <p className={'flex gap-4'}>Video downloaded {error.videoDownloaded ? <CircleCheck /> : <CircleX />}</p>
            <p className={'flex gap-4'}>Audio transcribed {error.audioTranscribed ? <CircleCheck /> : <CircleX />}</p>
            <p className={'flex gap-4'}>Recipe created {error.recipeCreated ? <CircleCheck /> : <CircleX />}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
