# Drop Shadow for Email

I found loads of resources for [adding a shadow to an email container using tables](https://agencyentourage.com/blog/drop-shadows-for-html-email/); I even found ways of [generating rounded corners for email containers](https://medium.com/@alexvargash/html-email-rounded-corners-2d58c42e491c). nowhere did I find a way to developing a container with rounded corners and a drop shadow. How come something which is so easy to do in CSS is such a pain in the arse for email?

Anyway, thanks to having some time, I cobbled this together; if you want to play with it, have at it. At present, there are some limitations.

* It assumes that there is a space where the drop shadow is repeated horizontally. This row has a data attribute of `main` so that you can find it once you get around to writing your email - I think it'd be best to place the content within a table within the inner div of that row.

* It probably works best with drop shadows that go up or down. I don't need it to work with drop shadows that aren't vertically aligned, so I've not put any thought into doing that - should you need it, and your changes do not break my use case, then you're welcome to make a PR.

It uses the brilliant [dom-to-image](https://github.com/tsayen/dom-to-image), all credit to [Anatolii Saienko](https://github.com/tsayen) for creating a brilliant tool. I tried [html2canvas](https://html2canvas.hertzen.com), but it didn't quite clock the drop shadow.

Should you want to run it, there's no fancy work involved. Just download and serve it how-so-ever you serve static HTML. Tweak the CSS in `index.html` to sort out your drop-shadow (bearing in mind the restrictions noted above) and refresh. You might need to tweak the padding if the shadow is _long_.
