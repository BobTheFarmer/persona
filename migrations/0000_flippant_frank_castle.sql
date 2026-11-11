CREATE TABLE "event_rsvps" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"location" text,
	"date_time" timestamp,
	"image_url" text,
	"tags" text[],
	"creator_id" varchar,
	"creator_name" text,
	"contact_info" text,
	"attendee_count" integer DEFAULT 0,
	"trait_novelty" real DEFAULT 0.5,
	"trait_intensity" real DEFAULT 0.5,
	"trait_cozy" real DEFAULT 0.5,
	"trait_strategy" real DEFAULT 0.5,
	"trait_social" real DEFAULT 0.5,
	"trait_creativity" real DEFAULT 0.5,
	"trait_nostalgia" real DEFAULT 0.5,
	"trait_adventure" real DEFAULT 0.5,
	"embedding" vector(384),
	"embedding_updated_at" timestamp,
	"location_lat" double precision,
	"location_lng" double precision,
	"club_id" varchar,
	"club_name" text,
	"signup_deadline" timestamp,
	"dues_deadline" timestamp,
	"cost" text,
	"rsvp_limit" integer,
	"location_details" text,
	"deal_expires_at" timestamp,
	"price_info" text,
	"is_deal" boolean DEFAULT false,
	"organizer_name" text
);
--> statement-breakpoint
CREATE TABLE "friendships" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"friend_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hobbies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text,
	"tags" text[],
	"starter_links" text[],
	"trait_novelty" real DEFAULT 0.5,
	"trait_intensity" real DEFAULT 0.5,
	"trait_cozy" real DEFAULT 0.5,
	"trait_strategy" real DEFAULT 0.5,
	"trait_social" real DEFAULT 0.5,
	"trait_creativity" real DEFAULT 0.5,
	"trait_nostalgia" real DEFAULT 0.5,
	"trait_adventure" real DEFAULT 0.5,
	"embedding" vector(384),
	"embedding_updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "interactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"item_id" varchar NOT NULL,
	"domain" text NOT NULL,
	"action" text NOT NULL,
	"weight" real DEFAULT 1,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain" text NOT NULL,
	"title" text NOT NULL,
	"image_url" text,
	"tags" text[],
	"description" text,
	"popularity" integer DEFAULT 0,
	"trait_novelty" real DEFAULT 0.5,
	"trait_intensity" real DEFAULT 0.5,
	"trait_cozy" real DEFAULT 0.5,
	"trait_strategy" real DEFAULT 0.5,
	"trait_social" real DEFAULT 0.5,
	"trait_creativity" real DEFAULT 0.5,
	"trait_nostalgia" real DEFAULT 0.5,
	"trait_adventure" real DEFAULT 0.5,
	"embedding" vector(384),
	"embedding_updated_at" timestamp,
	"next_meeting_at" timestamp,
	"meeting_location" text,
	"meeting_day" text,
	"meeting_time" text,
	"signup_url" text,
	"instagram_url" text,
	"dues" text,
	"dues_deadline" timestamp,
	"location_lat" double precision,
	"location_lng" double precision
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_a_id" varchar NOT NULL,
	"user_b_id" varchar NOT NULL,
	"score" integer NOT NULL,
	"color" text NOT NULL,
	"explanations" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "taste_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"trait_novelty" real DEFAULT 0.5,
	"trait_intensity" real DEFAULT 0.5,
	"trait_cozy" real DEFAULT 0.5,
	"trait_strategy" real DEFAULT 0.5,
	"trait_social" real DEFAULT 0.5,
	"trait_creativity" real DEFAULT 0.5,
	"trait_nostalgia" real DEFAULT 0.5,
	"trait_adventure" real DEFAULT 0.5,
	"top_clusters" text[],
	"onboarding_complete" boolean DEFAULT false,
	"is_extreme_demo" boolean DEFAULT false,
	"normal_traits" jsonb,
	"embedding" vector(384),
	"embedding_updated_at" timestamp,
	"location_lat" double precision,
	"location_lng" double precision,
	"privacy_radius_km" real DEFAULT 25,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "taste_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "auth_credentials" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"password_hash" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"location_lat" double precision,
	"location_lng" double precision,
	"privacy_radius_km" real DEFAULT 25,
	"grad_year" integer,
	"class_standing" varchar,
	"main_club_item_id" varchar,
	"instagram_url" varchar,
	"phone_number" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auth_credentials" ADD CONSTRAINT "auth_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_rsvps_event_idx" ON "event_rsvps" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_rsvps_user_idx" ON "event_rsvps" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "events_category_idx" ON "events" USING btree ("category");--> statement-breakpoint
CREATE INDEX "friendships_user_idx" ON "friendships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "friendships_friend_idx" ON "friendships" USING btree ("friend_id");--> statement-breakpoint
CREATE INDEX "interactions_user_idx" ON "interactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "items_domain_idx" ON "items" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");