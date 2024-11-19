* Shopify step 1 - create required files *

=> sections

membership-form.liquid
membership-area.liquid
thankyou-form.liquid

=> snippets

membership-script.liquid

=> assets

membership.css

=> create pages

Membership Form
Membership Area
Thankyou Form

=> create page template

membership-form
membership-area
thhankyou-form

* Shopify step 2 *

// Add at the end of head tag in theme.liduid
{{ 'membership.css' | asset_url | stylesheet_tag: preload: true }}

// Add at the end of body tag in theme.liduid
{% include 'membership-script' %}

* Shopify step 3 *

// add popup html according to you need in header or announcement bar or somewhere else
<div style="position:relative;">
  <a href='https://ickle-bubba-sandbox.myshopify.com/pages/member-form'>
    <div class="infoPopup" style='display:none;'>
      <div style="position:relative;">
        <p class='infoPopupMessage'></p>
        <span class="infoPopupClose">X</span>
      </div>
    </div>
  </a>
</div>
