
-- Grant admin role to talukdarsasanka348@gmail.com

insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where email = 'talukdarsasanka348@gmail.com'
on conflict (user_id, role) do nothing;
