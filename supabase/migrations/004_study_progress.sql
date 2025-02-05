create table study_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  flashcard_id uuid references flashcards(id) on delete cascade,
  last_reviewed timestamp with time zone default now(),
  next_review timestamp with time zone default now(),
  ease_factor float default 2.5,
  interval integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index study_progress_user_id_idx on study_progress(user_id);
create index study_progress_flashcard_id_idx on study_progress(flashcard_id);
create index study_progress_next_review_idx on study_progress(next_review); 