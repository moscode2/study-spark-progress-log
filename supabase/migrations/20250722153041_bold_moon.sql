@@ .. @@
-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
-  INSERT INTO public.profiles (user_id, first_name, last_name)
+  INSERT INTO public.profiles (user_id, first_name, last_name, role)
   VALUES (
     NEW.id,
     NEW.raw_user_meta_data->>'first_name',
-    NEW.raw_user_meta_data->>'last_name'
+    NEW.raw_user_meta_data->>'last_name',
+    'tenant'
   );
   RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;