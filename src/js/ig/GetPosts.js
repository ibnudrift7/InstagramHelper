/* globals GetFeed, GetProfile, GetPostInfo, instaUserInfo */
/* jshint -W106 */

var GetPosts = function (settings) { //eslint-disable-line no-unused-vars

  'use strict';

  var instaPosts, postInfo;

  var {
    mode, updateStatusDiv, end_cursor, vueStatus, userName, userId
  } = settings;

  var init = {
    'likeFeed': () => {
      instaPosts = new GetFeed({ updateStatusDiv: updateStatusDiv, end_cursor: end_cursor, vueStatus: vueStatus });
    },
    'likeProfile': () => {
      instaPosts = new GetProfile({ updateStatusDiv: updateStatusDiv, end_cursor: end_cursor, userId: userId, pageSize: 12, vueStatus: vueStatus });
      postInfo = new GetPostInfo({ updateStatusDiv: updateStatusDiv, vueStatus: vueStatus });
    }
  };

  var get = {
    'likeFeed': (restart) => {
      return instaPosts.getFeed(restart);
    },
    'likeProfile': () => {
      return instaPosts.getProfile();
    }
  };

  init[mode]();  //initialize the needed class

  function getPosts(restart) {
    //return instaPosts.getFeed(restart);
    return get[mode](restart);
  }

  function resolveUserName() {
    return new Promise((resolve, reject) => {
      if (('likeProfile' === mode) && ('' === userId)) {
        instaUserInfo.getUserProfile({ username: userName }).then(obj => {
          instaPosts.setUserId(obj.id);
          resolve();
        }, () => reject());
      } else {
        resolve();
      }
    });
  }

  function isNotLiked(media) {
    return new Promise(resolve => {
      if ('likeProfile' === mode) {
        postInfo.getPostInfo(media.node.shortcode).then(obj => {
          resolve(!obj.viewer_has_liked);
        });
      } else { //liking the feed
        resolve(!media.node.viewer_has_liked);
      }
    });
  }

  function hasMore() {
    return instaPosts.hasMore();
  }

  return {
    getPosts: getPosts,
    resolveUserName: resolveUserName,
    isNotLiked: isNotLiked,
    hasMore: hasMore
  };

};
