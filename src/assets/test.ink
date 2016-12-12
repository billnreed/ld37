=== first_mirror ===
You feel taunted by the mirror.
* [Yell at it] -> yell_mirror
* [Throw something] -> crack_mirror
* [Ignore] -> weave

=== yell_mirror ===
The mirror laughs at your feeble attempts.
-> END

=== crack_mirror ===
The mirror cracks, the curse has been lifted. You win.
-> END

=== weave ===
You weave for the rest of your days, until your demise.
-> END

=== scarf_with_lantern ===
The Lady draped her scarf over the lantern.
It was soon engulfed in flames.
She would weave no more.
-> END

=== book_with_mirror ===
Mirror: "I've already read all of that!"
-> END

=== short_argument ===
Lady: "Mirror mirror on the wall..."
Mirror: "You have to be joking."
* "Why must you keep me here[?"] asked the lady. Mirror: "A flame is best kept in a lantern far out of reach, where its radiant heat cannot scorch trembling hands." -> END
* "I can't stay here any longer, I'm going mad[!"]! The reflection you show me is but a shadow of the world that I long for. I must go to it." The mirror cackled, "Well have at it, my dear. By all means. The swiftest river could not carry you to Camelot in time, not before the curse takes you by the neck. But please do see for yourself." -> END
* "I'll smash you into a million pieces[!"], shouted the lady. "Be my guest," crooned the mirror. " -> END

=== long_argument ===
Lady: I'm really tired of weaving all day long.  I think I'm getting carpel tunnel syndrome.  

Mirror: "Half sick of shadows" one might say

* [Yes, exactly!]Mirror: Yes, this life of confinement is very difficult.  Remember though, this is your fate and the outside world poses an existential threat to you! 
    -> continued_dialogue
* [What?]You know, in the sense that your experiences are all indirect, like shadows...
	Lady: Yes, I see what you mean.
	Mirror: Remember, though, this is your fate and the outside world poses an existential threat to you.
	-> continued_dialogue

=== continued_dialogue ===
Lady: I just wish I could talk to another person, just once.

Mirror: Hey!  What are you trying to say?

Lady: Everyday I see the knights riding about, and the courtiers of Camelot, but I can't reach out to them.  I can't even turn around to call out my window.

Mirror: Ah, yes... I know what you mean... and of course, Sir Lancelot is especially...

* [I don't know what you are talking about] -> sexy_lancy
* [...] -> sexy_lancy

=== sexy_lancy ===
Mirror: Of course we know: "Tis better to have loved and lost, then never to have loved at all"

Lady: Ugh, thats not even the right poem.  

Mirror: You know, since you really have no choice but to accept the truly bizarre conditions of your life, you might consider some deep breathing and mindfulness exercises, maybe some affirmations.

* [Okay] -> ok
* [No thanks] -> no

=== ok ===
Mirror: Yay, this is going to be great! Okay, breath in, one, two, three. Breath out, one two three.  Say "I am one with the universe, I am present and grateful!  Ommm...."
Lady: "I am one with the universe, I am present...." Yeah, you know, on second thought, I don't think this is going to help that much.

Mirror: Fine, but I think you'd feel better if you tried harder! -> tried_harder_q

== no ==
Mirror: Fine, but I think you'd feel better if you tried harder -> tried_harder_q

=== tried_harder_q ===
* [Tried harder?] -> tried_harder

=== tried_harder ===
Lady: Tried harder?  Tried harder!!??
Lady: I literally weave ALL THE TIME!  I'm cursed, CURSED, but I don't even know what the curse is!  This whole situation is completely messed up!

Mirror: Okay, this attitude is not going to get you anywhere.

Lady: I really wish you would stop talking.  You know, sometimes I feel like you are not helping me.  

Mirror: You're so entitled!  And selfish!  And ungrateful!  Don't you see that I'm trying to protect you.

* [You're right, I'm sorry.] -> sorry
* [Well you know what, I don't need you anymore!] -> dont_need_you

=== sorry ===
Mirror: Thats more like it, now how about we try those deep breathing exercise again.
Lady: Sigh... Okay... "I am one with the universe...."
Mirror: Thats better, don't worry, we'll endure this life in perpetuity together.  It's gonna be great!.  
Lady: But I don't want to endure this!  I want to get out!
Mirror: Well you can't, if you do you'll die! I think....
Lady: I'll die?  Or you'll die? -> continue2

=== dont_need_you ===
Mirror: Oh, you don't need me?  Do you have any idea what would happen to you without me?
Lady: No, what?  What?  What would happen to me?  Do you even know? 
Mirror: Well, uh, I, I mean like you said, it's not really known.  But something really bad.  You'll probably die.
Lady: I'll die?  Or you'll die? -> continue2

=== continue2 ===
Mirror: You will die, the world will collapse, mayhem will ensue!

Lady: Well maybe thats a risk I'm willing to take.  Maybe I don't care!

Mirror: Noooo!

Lady: Be silent
 -> END

=== end_poem ===
Narrator: 

She left the web, she left the loom 
She made three paces thro' the room 
She saw the water-flower bloom, 
She saw the helmet and the plume, 
       She look'd down to Camelot. 
Out flew the web and floated wide; 
The mirror crack'd from side to side; 
'The curse is come upon me,' cried 
       The Lady of Shalott. -> END 