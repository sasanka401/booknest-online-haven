
insert into public.user_roles (user_id, role)
values ('62936d6f-d3ef-4c95-8cbe-4e68c640c775', 'admin')
on conflict (user_id, role) do nothing;
